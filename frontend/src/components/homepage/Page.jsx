import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "../Footer";
import logo from "./servicesynclogo.png";
import heroBackground from "./herobackground.png";
import { motion } from "framer-motion";
import { Users, Building, UserCog } from "lucide-react";

const Page = () => {
  return (
    <div className="flex flex-col min-h-screen dark:bg-gray-900">
      {/* Interactive Hero Section */}
      <section
        className="relative text-primary-foreground py-20"
        style={{
          backgroundImage: `url(${heroBackground})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-primary/40 dark:bg-gray-800/60" />
        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <img src={logo} alt="ServiceSync Logo" className="h-24 w-24" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-bold mb-4 dark:text-white"
          >
            Welcome to ServiceSync
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-xl mb-8 max-w-3xl mx-auto dark:text-gray-300"
          >
            A streamlined customer relationship management platform designed to
            connect customers, service providers, and administrators in one
            powerful ecosystem.
          </motion.p>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center dark:text-white">
            About ServiceSync
          </h2>
          <p className="text-lg text-center max-w-3xl mx-auto dark:text-gray-300">
            ServiceSync is designed to streamline service management and
            customer relationships. Our platform enables customers to book
            services with ease, allows service providers to manage requests
            efficiently, and provides administrators with powerful tools to
            ensure seamless operations.
          </p>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-16 bg-muted dark:bg-gray-700">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
            Key Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <Users className="h-12 w-12 text-primary dark:text-blue-400" />
              }
              title="Customer Management"
              description="Easily manage customer accounts, service requests, and communication."
            />
            <FeatureCard
              icon={
                <Building className="h-12 w-12 text-primary dark:text-blue-400" />
              }
              title="Service Provider Tools"
              description="Streamline operations with powerful service management and tracking tools."
            />
            <FeatureCard
              icon={
                <UserCog className="h-12 w-12 text-primary dark:text-blue-400" />
              }
              title="Admin Control"
              description="Comprehensive oversight and management of the entire service ecosystem."
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-background dark:bg-gray-800">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-12 text-center dark:text-white">
            Frequently Asked Questions
          </h2>
          <Accordion
            type="single"
            collapsible
            className="w-full max-w-3xl mx-auto"
          >
            <AccordionItem value="item-1">
              <AccordionTrigger className="dark:text-white">
                How does ServiceSync benefit customers?
              </AccordionTrigger>
              <AccordionContent className="dark:text-gray-300">
                ServiceSync allows customers to easily create accounts, book
                services, request specific job types, and track the progress of
                their service requests all in one platform.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="dark:text-white">
                What features are available for service providers?
              </AccordionTrigger>
              <AccordionContent className="dark:text-gray-300">
                Service providers can efficiently manage requests, track service
                fulfillment, handle customer feedback, and ensure quality
                service delivery through our comprehensive tools.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="dark:text-white">
                How does ServiceSync help administrators?
              </AccordionTrigger>
              <AccordionContent className="dark:text-gray-300">
                Administrators have access to powerful tools for managing
                accounts, controlling services and job types, overseeing the
                entire ecosystem, and monitoring user satisfaction.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
  >
    <div className="flex justify-center mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2 text-center dark:text-white">
      {title}
    </h3>
    <p className="text-gray-600 dark:text-gray-300 text-center">
      {description}
    </p>
  </motion.div>
);

export default Page;
