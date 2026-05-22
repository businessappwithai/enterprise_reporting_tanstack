import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db/config";
import { encrypt, decrypt } from "@/lib/security/encryption";
import { logAudit } from "@/lib/security/audit";
import type { DataSource } from "@/types/database";

export interface CreateDataSourceInput {
  name: string;
  description?: string;
  clientType: string;
  connectionConfig: Record<string, unknown>;
  userId: string;
}

export interface UpdateDataSourceInput {
  name?: string;
  description?: string | null;
  connectionConfig?: Record<string, unknown>;
  isActive?: boolean;
}

export interface DataSourceOutput {
  id: string;
  name: string;
  description: string | null;
  client_type: string;
  is_active: boolean;
  is_editable: boolean;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  created_by: string;
  connection_config?: Record<string, unknown>;
}

export class DataSourceService {
  static async list(options?: { inspectedOnly?: boolean }): Promise<Omit<DataSource, "connection_config">[]> {
    const db = getDb();
    let query = db
      .selectFrom("data_sources")
      .selectAll()
      .where("is_deleted", "=", false);

    if (options?.inspectedOnly) {
      // biome-ignore lint/suspicious/noExplicitAny: is_inspected not in generated Kysely types
      query = (query as any).where("is_inspected", "=", true);
    }

    const dataSources = await (query as any).orderBy("name", "asc").execute();
    // biome-ignore lint/suspicious/noExplicitAny: returning runtime shape
    return (dataSources as any[]).map(({ connection_config: _cc, ...rest }) => rest);
  }

  static async getById(id: string, includeConfig = false): Promise<DataSourceOutput | null> {
    const db = getDb();
    const dataSource = await db
      .selectFrom("data_sources")
      .selectAll()
      .where("id", "=", id)
      .where("is_deleted", "=", false)
      .executeTakeFirst();

    if (!dataSource) return null;

    const result: DataSourceOutput = {
      id: dataSource.id,
      name: dataSource.name,
      description: dataSource.description,
      client_type: dataSource.client_type,
      is_active: dataSource.is_active,
      is_editable: dataSource.is_editable ?? false,
      is_deleted: dataSource.is_deleted ?? false,
      created_at: dataSource.created_at,
      updated_at: dataSource.updated_at,
      created_by: dataSource.created_by ?? "",
    };

    if (includeConfig) {
      try {
        result.connection_config = JSON.parse(decrypt(dataSource.connection_config));
      } catch (e) {
        console.error("Failed to decrypt connection config:", e);
      }
    }

    return result;
  }

  static async create(input: CreateDataSourceInput): Promise<DataSourceOutput> {
    const { name, description, clientType, connectionConfig, userId } = input;

    if (!name?.trim()) {
      throw new Error("Data source name is required");
    }

    if (!clientType?.trim()) {
      throw new Error("Database type is required");
    }

    if (!connectionConfig || typeof connectionConfig !== "object") {
      throw new Error("Connection configuration is required");
    }

    const db = getDb();
    const id = randomUUID();
    const now = new Date().toISOString();
    const encryptedConfig = encrypt(JSON.stringify(connectionConfig));

    await db
      .insertInto("data_sources")
      .values({
        id,
        name: name.trim(),
        description: description?.trim() || null,
        client_type: clientType,
        connection_config: encryptedConfig,
        is_active: true,
        is_editable: false,
        is_deleted: false,
        deleted_at: null,
        deleted_by: null,
        created_by: userId,
        created_at: now,
        updated_at: now,
      })
      .execute();

    await logAudit({
      userId,
      action: "create",
      resourceType: "data_source",
      resourceId: id,
      details: { name, clientType },
    }).catch((err) => {
      console.error("Audit log error:", err);
    });

    const created = await this.getById(id);
    if (!created) {
      throw new Error("Failed to create data source");
    }

    return created;
  }

  static async update(
    id: string,
    input: UpdateDataSourceInput,
    userId: string
  ): Promise<DataSourceOutput> {
    const db = getDb();

    const existing = await db
      .selectFrom("data_sources")
      .select(["id", "created_by"])
      .where("id", "=", id)
      .where("is_deleted", "=", false)
      .executeTakeFirst();

    if (!existing) {
      throw new Error("Data source not found");
    }

    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (input.name !== undefined) {
      const trimmedName = input.name.trim();
      if (!trimmedName) {
        throw new Error("Data source name cannot be empty");
      }
      updateData.name = trimmedName;
    }

    if (input.description !== undefined) {
      updateData.description = input.description ? input.description.trim() : null;
    }

    if (input.isActive !== undefined) {
      updateData.is_active = input.isActive;
    }

    if (input.connectionConfig) {
      if (typeof input.connectionConfig !== "object") {
        throw new Error("Invalid connection configuration");
      }
      updateData.connection_config = encrypt(JSON.stringify(input.connectionConfig));
    }

    await db
      .updateTable("data_sources")
      .set(updateData)
      .where("id", "=", id)
      .execute();

    await logAudit({
      userId,
      action: "update",
      resourceType: "data_source",
      resourceId: id,
      details: { fields: Object.keys(updateData).filter((k) => k !== "updated_at") },
    }).catch((err) => {
      console.error("Audit log error:", err);
    });

    const updated = await this.getById(id);
    if (!updated) {
      throw new Error("Failed to retrieve updated data source");
    }

    return updated;
  }

  static async softDelete(id: string, userId: string): Promise<void> {
    const db = getDb();

    const existing = await db
      .selectFrom("data_sources")
      .select("id")
      .where("id", "=", id)
      .where("is_deleted", "=", false)
      .executeTakeFirst();

    if (!existing) {
      throw new Error("Data source not found");
    }

    const now = new Date().toISOString();

    await db
      .updateTable("data_sources")
      .set({
        is_deleted: true,
        deleted_at: now,
        deleted_by: userId,
        updated_at: now,
      })
      .where("id", "=", id)
      .execute();

    await logAudit({
      userId,
      action: "delete",
      resourceType: "data_source",
      resourceId: id,
      details: { operation: "soft_delete" },
    }).catch((err) => {
      console.error("Audit log error:", err);
    });
  }

  static async getUsageInfo(
    id: string
  ): Promise<{ queries: number; reports: number; charts: number }> {
    const db = getDb();

    const [queriesResult, reportsResult, chartsResult] = await Promise.all([
      db
        .selectFrom("saved_queries")
        .select(db.fn.count<number>("id").as("count"))
        .where("data_source_id", "=", id)
        .where("is_deleted", "=", false)
        .executeTakeFirst(),
      db
        .selectFrom("report_definitions")
        .select(db.fn.count<number>("id").as("count"))
        .where("is_deleted", "=", false)
        .executeTakeFirst(),
      db
        .selectFrom("chart_definitions")
        .select(db.fn.count<number>("id").as("count"))
        .where("is_deleted", "=", false)
        .executeTakeFirst(),
    ]);

    return {
      queries: Number(queriesResult?.count || 0),
      reports: Number(reportsResult?.count || 0),
      charts: Number(chartsResult?.count || 0),
    };
  }
}
