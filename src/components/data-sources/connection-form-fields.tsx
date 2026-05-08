import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Check, Loader2, X } from 'lucide-react';
import type { DatabaseClientType } from '@/types/database';
import { SqliteFileUpload } from './sqlite-file-upload';

export const DATABASE_TYPES: { value: DatabaseClientType; label: string }[] = [
  { value: 'pg', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'mssql', label: 'SQL Server' },
  { value: 'sqlite3', label: 'SQLite' },
  { value: 'oracledb', label: 'Oracle' },
];

export interface ConnectionFormState {
  name: string;
  description: string;
  clientType: DatabaseClientType;
  host: string;
  port: string;
  database: string;
  user: string;
  password: string;
  fileName: string;
}

interface ConnectionTestResult {
  success: boolean;
  message: string;
}

interface ConnectionFormFieldsProps {
  state: ConnectionFormState;
  onChange: (patch: Partial<ConnectionFormState>) => void;
  disableType?: boolean;
  passwordPlaceholder?: string;
  fileInputRef: React.RefObject<HTMLInputElement>;
  uploading: boolean;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  connectionTestResult: ConnectionTestResult | null;
  idPrefix?: string;
}

export function ConnectionFormFields({
  state,
  onChange,
  disableType = false,
  passwordPlaceholder = '********',
  fileInputRef,
  uploading,
  onFileSelect,
  onDragOver,
  onDrop,
  connectionTestResult,
  idPrefix = '',
}: ConnectionFormFieldsProps) {
  const set = (patch: Partial<ConnectionFormState>) => onChange(patch);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}ds-name`}>Name</Label>
          <Input
            id={`${idPrefix}ds-name`}
            value={state.name}
            onChange={(e) => set({ name: e.target.value })}
            placeholder="Production Database"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${idPrefix}ds-type`}>Database Type</Label>
          <Select
            value={state.clientType}
            onValueChange={(v) => set({ clientType: v as DatabaseClientType })}
            disabled={disableType}
          >
            <SelectTrigger id={`${idPrefix}ds-type`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DATABASE_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${idPrefix}ds-description`}>Description</Label>
        <Input
          id={`${idPrefix}ds-description`}
          value={state.description}
          onChange={(e) => set({ description: e.target.value })}
          placeholder="Optional description"
        />
      </div>

      {state.clientType === 'sqlite3' ? (
        <div className="space-y-2">
          <Label>Database File</Label>
          <SqliteFileUpload
            fileName={state.fileName}
            uploading={uploading}
            compact={disableType}
            fileInputRef={fileInputRef}
            onFileSelect={onFileSelect}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor={`${idPrefix}ds-host`}>Host</Label>
              <Input
                id={`${idPrefix}ds-host`}
                value={state.host}
                onChange={(e) => set({ host: e.target.value })}
                placeholder="localhost"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}ds-port`}>Port</Label>
              <Input
                id={`${idPrefix}ds-port`}
                value={state.port}
                onChange={(e) => set({ port: e.target.value })}
                placeholder={state.clientType === 'pg' ? '5432' : state.clientType === 'mysql' ? '3306' : ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`${idPrefix}ds-database`}>Database</Label>
            <Input
              id={`${idPrefix}ds-database`}
              value={state.database}
              onChange={(e) => set({ database: e.target.value })}
              placeholder="mydb"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}ds-user`}>Username</Label>
              <Input
                id={`${idPrefix}ds-user`}
                value={state.user}
                onChange={(e) => set({ user: e.target.value })}
                placeholder="dbuser"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${idPrefix}ds-password`}>Password</Label>
              <Input
                id={`${idPrefix}ds-password`}
                type="password"
                value={state.password}
                onChange={(e) => set({ password: e.target.value })}
                placeholder={passwordPlaceholder}
              />
            </div>
          </div>
        </>
      )}

      {connectionTestResult && (
        <div
          className={`p-3 rounded-md flex items-center gap-2 ${
            connectionTestResult.success
              ? 'bg-green-500 text-white dark:bg-green-600'
              : 'bg-red-500 text-white dark:bg-red-600'
          }`}
        >
          {connectionTestResult.success ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          <span className="font-medium">
            {connectionTestResult.success ? 'Connection Successful' : 'Connection Failed'}
          </span>
          {connectionTestResult.message && !connectionTestResult.success && (
            <span className="text-sm opacity-90">: {connectionTestResult.message}</span>
          )}
        </div>
      )}
    </>
  );
}

interface TestConnectionButtonProps {
  state: ConnectionFormState;
  testing: boolean;
}

export function isTestConnectionDisabled({ state, testing }: TestConnectionButtonProps) {
  if (testing) return true;
  if (state.clientType === 'sqlite3') return !state.fileName;
  return !state.host || !state.database || !state.user;
}

export function TestConnectionButton({ testing }: { testing: boolean }) {
  return (
    <>
      {testing && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
      Test Connection
    </>
  );
}
