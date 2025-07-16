import React from "react";
import { Link, useRouteError } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Code, Home, RefreshCw } from "lucide-react";

const Error = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-background/95 p-4 md:p-8">
            <div className="w-full max-w-md mx-auto text-center">
                <div className="relative mb-8">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <Code
                            className="w-64 h-64 text-primary"
                            strokeWidth={1}
                        />
                    </div>
                    <h1 className="text-8xl md:text-9xl font-bold text-primary animate-pulse">
                        404
                    </h1>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                    Oops! Code Not Found
                </h2>

                <p className="mb-8 text-muted-foreground text-lg">
                    The page you're looking for seems to have vanished into the
                    digital void.
                    {error?.message && (
                        <span className="block mt-2 text-sm p-2 rounded bg-destructive/10 text-destructive">
                            {error.message}
                        </span>
                    )}
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        variant="default"
                        size="lg"
                        asChild
                        className="gap-2"
                    >
                        <Link to="/">
                            <Home className="h-4 w-4" />
                            <span>Back to Home</span>
                        </Link>
                    </Button>

                    <Button
                        variant="outline"
                        size="lg"
                        asChild
                        className="gap-2"
                    >
                        <Link
                            to={-1}
                            onClick={(e) => {
                                e.preventDefault();
                                window.history.back();
                            }}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Go Back</span>
                        </Link>
                    </Button>

                    <Button
                        variant="secondary"
                        size="lg"
                        className="gap-2"
                        onClick={() => window.location.reload()}
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>Refresh</span>
                    </Button>
                </div>

                <div className="mt-12 text-sm text-muted-foreground">
                    <p>
                        Lost?{" "}
                        <Link
                            to="/search"
                            className="text-primary hover:underline"
                        >
                            Search the site
                        </Link>{" "}
                        or{" "}
                        <Link
                            to="/contact"
                            className="text-primary hover:underline"
                        >
                            contact us
                        </Link>{" "}
                        for help.
                    </p>
                </div>

                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent my-8"></div>

                <div className="text-xs text-muted-foreground/70">
                    <p>
                        © {new Date().getFullYear()} CodeSphere. All rights
                        reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Error;
