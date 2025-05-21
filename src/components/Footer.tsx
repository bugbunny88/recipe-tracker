import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

// Animation component to match the Home page
const AnimateOnScroll: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: 'fadeIn' | 'slideUp';
}> = ({
  children,
  className = '',
  delay = 0,
  animation = 'fadeIn'
}) => {
    const { ref, inView } = useInView({
      threshold: 0.1,
      triggerOnce: true,
    });

    const animationClass = animation === 'fadeIn'
      ? 'opacity-0 transition-opacity duration-1000'
      : 'opacity-0 translate-y-6 transition-all duration-1000';

    return (
      <div
        ref={ref}
        className={`${animationClass} ${className} ${inView ? 'opacity-100 translate-y-0' : ''}`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        {children}
      </div>
    );
  };

const Footer: React.FC = () => {
  return (
    <>
      {/* Newsletter Section */}
      <section className="py-24 bg-zesty-olive text-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <AnimateOnScroll animation="fadeIn">
            <div className="text-center mb-2">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="h-px w-12 bg-white/30"></div>
                <span className="uppercase tracking-widest text-sm text-white/90">Newsletter</span>
                <div className="h-px w-12 bg-white/30"></div>
              </div>
              <h2 className="font-elegant text-5xl md:text-6xl font-light mb-12 tracking-wide text-white">
                SIGN UP TO OUR<br />NEWSLETTER
              </h2>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll animation="slideUp" delay={300}>
            <form className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
              <input
                type="email"
                placeholder="YOUR EMAIL..."
                className="flex-grow py-4 px-6 bg-zesty-cream/90 border-none text-zesty-brown focus:outline-none focus:ring-1 focus:ring-zesty-coral/50"
              />
              <button
                type="submit"
                className="py-4 px-8 bg-zesty-coral text-white uppercase tracking-wider font-medium hover:bg-zesty-brown transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Footer Links Section */}
      <footer className="bg-gradient-to-t from-zesty-peach/80 to-zesty-cream py-16">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <AnimateOnScroll className="w-full md:w-auto" delay={100}>
              <div className="text-zesty-brown">
                <h3 className="uppercase tracking-widest text-sm font-medium mb-6">Social</h3>
                <div className="flex flex-col space-y-4">
                  <a href="#" className="uppercase text-sm tracking-wide text-zesty-brown/80 hover:text-zesty-coral transition-colors">
                    Instagram
                  </a>
                  <a href="#" className="uppercase text-sm tracking-wide text-zesty-brown/80 hover:text-zesty-coral transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="uppercase text-sm tracking-wide text-zesty-brown/80 hover:text-zesty-coral transition-colors">
                    Twitter
                  </a>
                </div>
              </div>
            </AnimateOnScroll>

            {/* Center divider */}
            <div className="hidden md:block h-16 w-px bg-zesty-brown/20 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-zesty-brown/20"></div>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-zesty-brown/20"></div>
            </div>

            <AnimateOnScroll className="w-full md:w-auto" delay={200}>
              <div className="text-zesty-brown">
                <h3 className="uppercase tracking-widest text-sm font-medium mb-6">Quick Links</h3>
                <div className="flex flex-col space-y-4">
                  <Link to="/" className="uppercase text-sm tracking-wide text-zesty-brown/80 hover:text-zesty-coral transition-colors">
                    Recipes
                  </Link>
                  <Link to="/recipes" className="uppercase text-sm tracking-wide text-zesty-brown/80 hover:text-zesty-coral transition-colors">
                    Collections
                  </Link>
                  <Link to="/about" className="uppercase text-sm tracking-wide text-zesty-brown/80 hover:text-zesty-coral transition-colors">
                    About
                  </Link>
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          <div className="mt-16 pt-10 border-t border-zesty-brown/10 text-center">
            <p className="text-sm text-zesty-brown/60">
              © {new Date().getFullYear()} Masa Mía. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;