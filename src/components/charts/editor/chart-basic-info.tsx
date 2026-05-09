import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChartBasicInfoProps {
  chartName: string;
  chartDescription: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
}

export function ChartBasicInfo({
  chartName,
  chartDescription,
  onNameChange,
  onDescriptionChange,
}: ChartBasicInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="chart-name">Chart Name *</Label>
          <Input
            id="chart-name"
            value={chartName}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="My Sales Chart"
          />
        </div>
        <div>
          <Label htmlFor="chart-description">Description</Label>
          <Textarea
            id="chart-description"
            value={chartDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Describe what this chart shows..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
