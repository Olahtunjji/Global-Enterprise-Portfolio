import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetBusinessProfile, useListServices } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import heroWorkshop from "../assets/hero-workshop.png";

export default function Home() {
  const { data: profile } = useGetBusinessProfile();
  const { data: services } = useListServices();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src={heroWorkshop} 
          alt="Diesel Marine Engine Workshop" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="container relative z-20 px-4 text-center text-white">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold tracking-tight mb-4"
          >
            EMMYFAD Global Enterprise
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl font-light mb-8 max-w-2xl mx-auto opacity-90"
          >
            Purchase, repair, and servicing of diesel engines and marine equipment. Expert maritime project supervising.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/contact">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4 mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-primary mb-4">Our Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive maritime engineering solutions tailored to your operational needs.
            </p>
          </div>
          
          {services && (
            <motion.div 
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {services.map((service) => {
                const IconComponent = (Icons as any)[service.iconKey] || Icons.Wrench;
                return (
                  <motion.div key={service.id} variants={item}>
                    <Link href={`/services/${service.slug}`}>
                      <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border group">
                        <CardHeader>
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors text-primary">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <CardTitle className="text-xl">{service.title}</CardTitle>
                          <CardDescription className="text-sm font-medium text-accent">{service.tagline}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground text-sm line-clamp-3">
                            {service.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      {/* Profile Section */}
      {profile && (
        <section className="py-20">
          <div className="container px-4 mx-auto max-w-4xl">
            <Card className="border-border shadow-md">
              <CardHeader className="text-center pb-8 border-b border-border">
                <CardTitle className="text-3xl text-primary">{profile.ownerName}</CardTitle>
                <CardDescription className="text-lg">Chief Executive Officer</CardDescription>
              </CardHeader>
              <CardContent className="pt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Business Identity</h4>
                      <p className="text-foreground">{profile.businessName}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">NIN (Masked)</h4>
                      <p className="text-foreground font-mono">{profile.nin ? "27492-XXXXX-2229" : "Not Provided"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Contact</h4>
                      <p className="text-foreground">{profile.email}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Headquarters</h4>
                      <p className="text-foreground">{profile.address}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">About</h4>
                      <p className="text-foreground text-sm leading-relaxed">{profile.bio}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  );
}