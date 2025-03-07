import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Map, Database, Shield, Leaf, Users, Globe, BarChart2, Home as HomeIcon, Info, Mail, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

// Import the video
import globeVideo from '/1851190-uhd_3840_2160_25fps.mp4';

const features = [
  {
    icon: Map,
    title: 'Oil Spill Detection',
    description: 'Advanced satellite imagery analysis for real-time oil spill detection and monitoring.'
  },
  {
    icon: Activity,
    title: 'AQI Estimation',
    description: 'Accurate air quality index estimation using multi-spectral satellite data.'
  },
  {
    icon: Database,
    title: 'Interactive Map',
    description: 'User-friendly interface for visualizing and analyzing pollution events.'
  },
  {
    icon: Shield,
    title: 'Blockchain Logging',
    description: 'Immutable record-keeping of pollution events using blockchain technology.'
  }
];

const stats = [
  { label: 'Active Monitoring Sites', value: '1,234' },
  { label: 'Environmental Reports', value: '45.6K' },
  { label: 'Countries Covered', value: '89' },
  { label: 'Data Points Collected', value: '2.3M' },
];

const Home = () => {
  return (
    <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-0"
      >
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video 
            className="w-full h-full object-cover" 
            autoPlay 
            loop 
            muted 
            playsInline
          >
            <source src="/1851190-uhd_3840_2160_25fps.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Fixed Navigation Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center">
                <Globe className="h-8 w-8 text-green-400 mr-2" />
                <span className="text-2xl font-bold text-green-400">VeriEarth</span>
              </div>
              
              {/* Navigation Links */}
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <HomeIcon className="h-4 w-4 mr-1" />
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <BarChart2 className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                  <Link
                    to="/about"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Info className="h-4 w-4 mr-1" />
                    About
                  </Link>
                  <Link
                    to="/contact"
                    className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center"
                  >
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Link>
                </div>
              </div>

              {/* CTA Button */}
              <div className="hidden md:block">
                <Link
                  to="/register"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                >
                  <UserPlus className="h-4 w-4 mr-1" />
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Add padding to account for fixed header */}
        <div className="pt-16">
          {/* Hero Content */}
          <div className="h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                  <span className="block">VeriEarth</span>
                  <span className="block text-green-400">Environmental Intelligence</span>
                </h1>
                <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                  Real-time pollution monitoring and detection powered by satellite imagery and AI. Making environmental data accessible, transparent, and actionable.
                </p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <div className="rounded-md shadow">
                    <Link
                      to="/dashboard"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                    >
                      <Map className="w-5 h-5 mr-2" />
                      View Live Data
                    </Link>
                  </div>
                  <div className="mt-3 sm:mt-0 sm:ml-3">
                    <Link
                      to="/about"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-transparent hover:bg-gray-800 md:py-4 md:text-lg md:px-10 border-green-400"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Pollution Causes Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-12"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Visual Separator */}
              <div className="w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent mb-12"></div>
              
              <div className="lg:text-center">
                <h2 className="text-3xl leading-8 font-extrabold tracking-tight text-green-400 sm:text-4xl">
                  Major Causes of Air Pollution
                </h2>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="bg-gray-700/90 backdrop-blur-sm rounded-lg p-6 hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300 flex items-center group"
                  >
                    <div className="w-32 h-32 mr-6 relative">
                      {/* Cigarette Image */}
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 z-10">
                        <svg width="60" height="20" viewBox="0 0 60 20">
                          {/* Cigarette Body (White) */}
                          <rect x="10" y="8" width="40" height="4" fill="#FFFFFF" rx="1"/>
                          {/* Filter (Orange) */}
                          <rect x="50" y="8" width="10" height="4" fill="#FFA500" rx="1"/>
                          {/* Ash (Grey) */}
                          <rect x="5" y="8" width="5" height="4" fill="#A9A9A9" rx="1"/>
                        </svg>
                      </div>
                      {/* Smoke Animation */}
                      <div className="absolute inset-0 -translate-x-4">
                        <DotLottieReact
                          src="https://lottie.host/a038a346-7176-4004-a8e8-71b7f3f6186d/0MzbLZ8LUm.lottie"
                          loop
                          autoplay
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition-colors">Cigarette Smoking</h3>
                      <p className="mt-2 text-sm text-gray-300">
                        A significant source of indoor air pollution, releasing harmful chemicals and particulate matter.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                    className="bg-gray-700/90 backdrop-blur-sm rounded-lg p-6 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 flex items-center group"
                  >
                    <div className="w-40 h-40 mr-6 relative">
                      {/* Industrial Emissions Animation */}
                      <div className="absolute inset-0">
                        <DotLottieReact
                          src="https://lottie.host/30b33797-5ff8-49ce-a158-fe1ff5666c77/SvkVWoVxLu.lottie"
                          loop
                          autoplay
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-orange-400 transition-colors">Industrial Emissions</h3>
                      <p className="mt-2 text-sm text-gray-300">
                        Factories and power plants releasing pollutants and greenhouse gases into the atmosphere.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                    className="bg-gray-700/90 backdrop-blur-sm rounded-lg p-6 hover:shadow-lg hover:shadow-yellow-500/10 transition-all duration-300 flex items-center group"
                  >
                    <div className="w-32 h-32 mr-6 relative">
                      {/* Firewood Animation */}
                      <div className="absolute inset-0">
                        <DotLottieReact
                          src="https://lottie.host/30b1c901-513c-4d25-8546-550ae2c3f062/IfIfSRT2zO.lottie"
                          loop
                          autoplay
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">Firewood Burning</h3>
                      <p className="mt-2 text-sm text-gray-300">
                        Traditional biomass burning contributing to particulate matter and carbon emissions.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                    className="bg-gray-700/90 backdrop-blur-sm rounded-lg p-6 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 flex items-center group"
                  >
                    <div className="w-40 h-40 mr-6 relative">
                      {/* Vehicle Emissions Animation */}
                      <div className="absolute inset-0">
                        <DotLottieReact
                          src="https://lottie.host/c8b65030-c0c8-477f-9cf4-e22667a8d8b2/d8wuot5gah.lottie"
                          loop
                          autoplay
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">Vehicle Emissions</h3>
                      <p className="mt-2 text-sm text-gray-300">
                        Transportation sources releasing nitrogen oxides and particulate matter into the air.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-12 bg-gray-900/90 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-green-400 font-semibold tracking-wide uppercase">Features</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                  Comprehensive Environmental Monitoring
                </p>
                <p className="mt-4 max-w-2xl text-xl text-white lg:mx-auto">
                  Our platform combines cutting-edge technology with user-friendly interfaces to provide accurate and actionable environmental data.
                </p>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
                  {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="relative bg-gray-800 p-6 rounded-lg"
                      >
                        <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                          <Icon className="h-6 w-6" aria-hidden="true" />
                        </div>
                        <p className="ml-16 text-lg leading-6 font-medium text-white">{feature.title}</p>
                        <p className="mt-2 ml-16 text-base text-white">{feature.description}</p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-800/90 backdrop-blur-sm py-12"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center"
                  >
                    <div className="text-4xl font-bold text-green-400">{stat.value}</div>
                    <div className="mt-2 text-sm text-white">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* How It Works Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-12 bg-gray-900/90 backdrop-blur-sm"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="lg:text-center">
                <h2 className="text-base text-green-400 font-semibold tracking-wide uppercase">How It Works</h2>
                <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
                  Our Process
                </p>
              </div>

              <div className="mt-10">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative bg-gray-800 p-6 rounded-lg"
                  >
                    <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-700 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80"
                        alt="Satellite imagery"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white">Satellite Data Collection</h3>
                      <p className="mt-2 text-white">
                        We collect real-time satellite imagery from multiple sources to monitor environmental changes.
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative bg-gray-800 p-6 rounded-lg"
                  >
                    <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-700 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1488229297570-58520851e868?auto=format&fit=crop&q=80"
                        alt="AI Analysis"
                        className="object-cover"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-xl font-bold text-white">AI-Powered Analysis</h3>
                      <p className="mt-2 text-white">
                        Our advanced AI algorithms analyze the data to detect pollution events and environmental changes.
                      </p>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-gray-800/90 backdrop-blur-sm py-12"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                  Ready to Make a Difference?
                </h2>
                <p className="mt-4 text-lg text-gray-300">
                  Join us in our mission to protect and monitor our environment.
                </p>
                <div className="mt-8">
                  <Link
                    to="/register"
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
