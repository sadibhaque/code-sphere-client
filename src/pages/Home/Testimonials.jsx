import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Quote } from "lucide-react";

const items = [
    {
        name: "Ayesha",
        role: "Frontend Dev",
        quote: "CodeSphere helped me get faster answers and meet devs who care.",
    },
    {
        name: "Rahim",
        role: "Full-stack Engineer",
        quote: "I love the quality of discussions and the vibe of the community.",
    },
    {
        name: "Ria",
        role: "Student",
        quote: "Posting is easy and the feedback is super helpful!",
    },
];

export default function Testimonials() {
    return (
        <section id="testimonials" className="w-full py-12 animate-fade-in">
            <div className="container mx-auto max-w-4xl px-4 lg:px-0 lg:max-w-10/12">
                <Card className="border-0 shadow-xl hover-lift">
                    <CardHeader className="flex items-center gap-3">
                        <div className="p-3 rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
                            <Quote className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gradient">
                            What members say
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {items.map((t) => (
                                <div
                                    key={t.name}
                                    className="rounded-2xl border bg-card p-5"
                                >
                                    <div className="text-lg font-semibold">
                                        {t.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground mb-2">
                                        {t.role}
                                    </div>
                                    <p className="text-sm">“{t.quote}”</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
}
