import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

export default function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">{description}</p>
        </div>
      </div>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-20">
          <Construction className="mb-3 h-12 w-12 text-muted-foreground/30" />
          <p className="text-sm font-medium text-muted-foreground">Coming Soon</p>
          <p className="text-xs text-muted-foreground mt-1">This module is under development</p>
        </CardContent>
      </Card>
    </div>
  );
}
