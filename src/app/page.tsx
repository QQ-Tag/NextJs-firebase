import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContainer } from "@/components/shared/PageContainer";
import Link from "next/link";
import { QrCode, ShieldCheck, UserPlus, Search } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  return (
    <PageContainer className="flex flex-col items-center text-center">
      <section className="py-16 md:py-24 lg:py-32 w-full">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                  Never Lose Your Valuables Again
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  StickerFind helps you recover lost items with smart QR code stickers. Simple for owners, easy for finders.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Link href="/signup">Get Started</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </div>
            <Image
              src="https://placehold.co/600x400.png"
              alt="Hero Image"
              width={600}
              height={400}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
              data-ai-hint="qr code items"
            />
          </div>
        </div>
      </section>

      <section id="features" className="py-16 md:py-24 lg:py-32 bg-secondary w-full">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How StickerFind Works</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our system is designed for simplicity and effectiveness, ensuring your lost items find their way back to you.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <UserPlus className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Easy Account Setup</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Quickly sign up with email or Google. Link QR stickers to your account and keep your contact details updated.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <QrCode className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Smart QR Stickers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Attach durable, weatherproof QR stickers to your belongings. Each QR code is unique and links to your contact info.
                </CardDescription>
              </CardContent>
            </Card>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="items-center">
                <Search className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Simple Finder Process</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Finders scan the QR code to view your contact details instantly. No login required for them.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 lg:py-32 w-full">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to protect your items?
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Join StickerFind today and experience peace of mind.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link href="/signup">Sign Up Now</Link>
            </Button>
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-2 text-accent hover:text-accent/80">
                Login
              </Link>
            </p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
