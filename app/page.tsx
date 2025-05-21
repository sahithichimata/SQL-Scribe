import { Hero } from "@/components/home/hero"
import { Features } from "@/components/home/features"
import { DemoSection } from "@/components/home/demo-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <>
      <Hero />
      
      <Features />
      
      <DemoSection />
      
      <section className="container py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to transform how you work with SQL?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of data professionals who are saving time and improving productivity with SQL Scribe.
          </p>
          <Link href="/app">
            <Button size="lg" className="group">
              <span>Get Started Today</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  )
}