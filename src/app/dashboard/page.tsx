import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function DashboardPage() {
  const data = [
    {
      title: "Users",
      link: "/dashboard/users",
      description: "Manage users and their roles.",
    },
    {
      title: "Settings",
      link: "/dashboard/settings",
      description: "Configure application settings.",
    },
    {
      title: "Analytics",
      link: "/dashboard/analytics",
      description: "View performance metrics.",
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <Link key={item.title} href={item.link} passHref>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
