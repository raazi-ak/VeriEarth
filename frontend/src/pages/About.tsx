import React from 'react';
import { Brain, Database, Cpu, GitBranch, Target, Globe, Shield, Leaf, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const technologies = [
  {
    icon: Brain,
    name: 'AI Models',
    description: 'U-Net and CNN models for satellite imagery analysis and pollution detection',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80'
  },
  {
    icon: Database,
    name: 'Satellite Data',
    description: 'Integration with Sentinel-1/5P satellites for comprehensive environmental monitoring',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80'
  },
  {
    icon: Cpu,
    name: 'Processing Pipeline',
    description: 'Advanced data processing pipeline for real-time pollution detection',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80'
  },
  {
    icon: GitBranch,
    name: 'Blockchain Integration',
    description: 'Polygon blockchain integration for immutable pollution event logging',
    image: 'https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80'
  }
];

const timeline = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'VeriEarth was founded with a vision to revolutionize environmental monitoring.'
  },
  {
    year: '2021',
    title: 'AI Integration',
    description: 'Successfully implemented AI models for pollution detection.'
  },
  {
    year: '2022',
    title: 'Global Expansion',
    description: 'Expanded operations to cover multiple continents and regions.'
  },
  {
    year: '2023',
    title: 'Blockchain Launch',
    description: 'Introduced blockchain-based verification system for environmental data.'
  }
];

const About = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80")',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              About VeriEarth
            </h1>
            <p className="mt-6 text-xl text-gray-300 max-w-3xl mx-auto">
              Empowering environmental protection through advanced technology and data-driven insights.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-400 tracking-wide uppercase">Our Mission</h2>
          <p className="mt-1 text-4xl font-extrabold text-white sm:text-5xl sm:tracking-tight lg:text-6xl">
            Making Environmental Data Accessible
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-300">
            We're committed to providing transparent, real-time environmental monitoring data to empower decision-makers and protect our planet.
          </p>
        </div>
      </div>

      {/* Vision Section */}
      <div className="bg-gray-800/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white">Our Vision</h2>
              <p className="mt-4 text-lg text-gray-300">
                We envision a world where environmental data is freely accessible, enabling informed decisions that protect our planet's future. Through innovative technology and collaborative partnerships, we're building a sustainable tomorrow.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-8">
                <div className="flex items-center">
                  <Target className="h-8 w-8 text-green-400 mr-3" />
                  <span className="text-white">Precision Monitoring</span>
                </div>
                <div className="flex items-center">
                  <Globe className="h-8 w-8 text-green-400 mr-3" />
                  <span className="text-white">Global Impact</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-8 w-8 text-green-400 mr-3" />
                  <span className="text-white">Data Security</span>
                </div>
                <div className="flex items-center">
                  <Leaf className="h-8 w-8 text-green-400 mr-3" />
                  <span className="text-white">Sustainability</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80"
                alt="Environmental monitoring"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="bg-gray-900/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-green-400 tracking-wide uppercase">Technology Stack</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">Powered by Cutting-Edge Technology</p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {technologies.map((tech, index) => {
                const Icon = tech.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="relative group"
                  >
                    <div className="relative h-48 overflow-hidden rounded-lg">
                      <img
                        src={tech.image}
                        alt={tech.name}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-opacity duration-300"></div>
                    </div>
                    <div className="absolute -mt-6 left-6 right-6 bg-gray-800 rounded-lg p-4 shadow-xl">
                      <div className="flex items-center">
                        <span className="inline-flex items-center justify-center p-2 bg-green-500 rounded-md shadow-lg">
                          <Icon className="h-6 w-6 text-white" aria-hidden="true" />
                        </span>
                        <h3 className="ml-3 text-lg font-medium text-white">{tech.name}</h3>
                      </div>
                      <p className="mt-2 text-sm text-gray-300">{tech.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-gray-900/80 backdrop-blur-sm py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-green-400 tracking-wide uppercase">Our Journey</h2>
            <p className="mt-2 text-3xl font-extrabold text-white">Milestones</p>
          </div>

          <div className="mt-12">
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-center"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-500">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <span className="text-xl font-bold text-green-400">{item.year}</span>
                      <h3 className="ml-2 text-lg font-medium text-white">{item.title}</h3>
                    </div>
                    <p className="mt-1 text-gray-300">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;