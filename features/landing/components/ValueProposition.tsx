'use client';

import { motion } from 'framer-motion';
import { ChartBar as BarChart, Italic as Crystal, Compass, Rocket } from 'lucide-react';

const features = [
  {
    icon: BarChart,
    title: 'Análises Descritivas',
    description: 'saiba o que aconteceu.',
  },
  {
    icon: Crystal,
    title: 'Análises Preditivas',
    description: 'antecipe tendências e resultados.',
  },
  {
    icon: Compass,
    title: 'Análises Prescritivas',
    description: 'saiba exatamente o que fazer.',
  },
  {
    icon: Rocket,
    title: 'Centralização',
    description: 'todos os indicadores de marca, comunicação e performance num só lugar.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

export default function ValueProposition() {
  return (
    <section className="py-24">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-headline mb-6">
            Pataforma que {' '}
            <span className="bg-gradient-to-r from-hoko-primary to-hoko-secondary bg-clip-text text-transparent">
              revela o valor real da sua marca
            </span>{' '}
            ao transformar dados em inteligência.
          </h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 }
                }}
                className="group"
              >
                <div className="dark-block p-8 h-full hover:shadow-brand transition-all duration-300 border group-hover:border-hoko-primary/20">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl gradient-brand mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-hoko-primary transition-colors duration-300">
                    📊 {feature.title}
                  </h3>

                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center dark-block-subtle rounded-full px-6 py-3">
            <div className="flex items-center space-x-4 text-sm">
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-foreground">Dados em tempo real</span>
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-foreground">IA proprietária</span>
              </span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                <span className="text-foreground">Insights acionáveis</span>
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}