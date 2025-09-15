import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, User, ArrowRight, Clock } from "lucide-react";

import image from "../../assets/images/bunting-kargbo-QscxOdWRkU0-unsplash.jpg";
import image2 from "../../assets/images/camila-blando-8rt6kbL4tKk-unsplash.jpg";
import image3 from "../../assets/images/technology-female-image.jpg";

const blogs = [
  {
    id: "blog",
    category: "Blog",
    image: image,
    subtitle: "Stories & Insights",
    articles: [
      {
        title: "The Future of Fashion Design is Here",
        excerpt: "Discover how AI is revolutionizing the fashion industry and changing the way designers create stunning outfits.",
        content: `
          The fashion industry is experiencing a digital transformation like never before. With the advent of artificial intelligence, designers are no longer limited by traditional constraints. TailorTech represents the cutting edge of this revolution, enabling creators to bring their wildest fashion dreams to life with just a few words.

          Our AI-powered platform analyzes thousands of fashion trends, color combinations, and style preferences to generate unique designs that perfectly match your vision. Whether you're a seasoned designer or just starting your fashion journey, TailorTech makes professional-quality design accessible to everyone.

          From concept to creation, our platform streamlines the entire design process, allowing you to focus on what matters most - your creativity. Join the thousands of designers who are already using AI to push the boundaries of fashion innovation.
        `,
        author: "Muhammad Sheraz",
        date: "2024-01-15",
        readTime: "5 min read"
      },
      {
        title: "From Sketch to Reality: The Design Process",
        excerpt: "Learn about the seamless workflow from initial concept to finished garment using TailorTech's innovative tools.",
        content: `
          Creating a fashion piece has never been more intuitive. Our streamlined process transforms your ideas into tangible designs through a series of innovative steps that blend creativity with technology.

          Starting with a simple text description, our AI engine interprets your vision and generates multiple design variations. You can then refine these concepts using our 3D visualization tools, seeing exactly how your design will look on different body types and in various fabrics.

          The magic happens when you watch your creation come to life on our virtual runway. This immersive experience gives you a complete understanding of how your design moves and flows, ensuring that every detail is perfect before production.
        `,
        author: "Sheeza Ijaz",
        date: "2024-01-12",
        readTime: "4 min read"
      },
      {
        title: "Building Your Fashion Brand with AI",
        excerpt: "Explore strategies for leveraging AI tools to create a unique fashion brand identity and stand out in the market.",
        content: `
          In today's competitive fashion landscape, having a unique brand identity is crucial for success. TailorTech empowers emerging designers and established brands alike to create distinctive collections that resonate with their target audience.

          Our platform's ability to generate diverse design concepts means you can explore multiple creative directions quickly and efficiently. This rapid iteration process allows you to identify your brand's unique aesthetic and develop a cohesive collection that tells your story.

          Success in fashion isn't just about great designs – it's about understanding your market, your customers, and your unique value proposition. With TailorTech's analytics and insights, you can make data-driven decisions about your designs while maintaining your creative vision.
        `,
        author: "Muhammad Hamza",
        date: "2024-01-10",
        readTime: "6 min read"
      }
    ]
  },
  {
    id: "fashion",
    category: "Fashion",
    image: image2,
    subtitle: "Trends & Styles",
    articles: [
      {
        title: "2024 Fashion Trends: What's Next?",
        excerpt: "Stay ahead of the curve with our comprehensive guide to the hottest fashion trends shaping the industry.",
        content: `
          As we move through 2024, fashion continues to evolve at an unprecedented pace. This year brings a fascinating blend of nostalgic elements and futuristic innovations that reflect our changing world and values.

          Sustainability remains at the forefront, with eco-conscious materials and production methods becoming standard rather than exceptional. Consumers are increasingly demanding transparency in the fashion supply chain, driving brands to adopt more responsible practices.

          Color palettes this year are bold yet sophisticated, featuring vibrant greens, deep purples, and warm terracotta tones. These colors work beautifully with both classic silhouettes and avant-garde designs, offering versatility for designers and consumers alike.

          Technology integration in fashion is no longer optional – it's essential. From smart fabrics that adapt to environmental conditions to AI-generated patterns that create unique visual experiences, the intersection of fashion and technology continues to expand possibilities.
        `,
        author: "Fashion Team",
        date: "2024-01-18",
        readTime: "7 min read"
      },
      {
        title: "Sustainable Fashion: The Conscious Choice",
        excerpt: "Discover how sustainable practices are reshaping the fashion industry and how you can contribute to positive change.",
        content: `
          The fashion industry is undergoing a crucial transformation towards sustainability, and this shift is more than just a trend – it's a necessity. As consumers become more environmentally conscious, the demand for sustainable fashion practices continues to grow.

          Sustainable fashion encompasses every aspect of the garment lifecycle, from material sourcing to production methods and end-of-life disposal. Innovative materials like recycled polyester, organic cotton, and lab-grown leather are becoming mainstream alternatives to traditional options.

          TailorTech supports this movement by enabling designers to visualize their creations digitally before production, reducing waste from physical prototypes. Our platform also provides information about sustainable fabric options and their environmental impact, helping designers make informed choices.

          The future of fashion is not just about looking good – it's about feeling good about the choices we make. By embracing sustainable practices and supporting brands that prioritize environmental responsibility, we can all contribute to a more sustainable fashion ecosystem.
        `,
        author: "Sustainability Team",
        date: "2024-01-14",
        readTime: "5 min read"
      },
      {
        title: "Color Psychology in Fashion Design",
        excerpt: "Understand how colors influence emotions and behavior, and learn to use this knowledge in your fashion designs.",
        content: `
          Color is one of the most powerful tools in a fashion designer's arsenal. It has the ability to evoke emotions, convey messages, and create lasting impressions. Understanding color psychology can elevate your designs from merely aesthetic to truly impactful.

          Different colors trigger different psychological responses. Red exudes confidence and passion, making it perfect for statement pieces. Blue conveys trust and stability, ideal for professional wear. Green represents growth and harmony, excellent for sustainable fashion lines.

          When designing with TailorTech, our AI considers color psychology principles to suggest combinations that not only look beautiful but also align with the emotional message you want to convey. This scientific approach to color selection ensures your designs resonate with your intended audience.

          The key to successful color application lies in understanding your target market and the context in which your garments will be worn. Whether designing for corporate environments, casual wear, or special occasions, color choice can make or break the success of your piece.
        `,
        author: "Design Team",
        date: "2024-01-08",
        readTime: "4 min read"
      }
    ]
  },
  {
    id: "technology",
    category: "Technology",
    image: image3,
    subtitle: "Innovation Hub",
    articles: [
      {
        title: "AI in Fashion: Beyond the Hype",
        excerpt: "Explore the real-world applications of artificial intelligence in fashion design and manufacturing.",
        content: `
          Artificial intelligence in fashion has moved far beyond the realm of science fiction into practical, everyday applications that are transforming how we design, produce, and consume fashion. At TailorTech, we're at the forefront of this technological revolution.

          Our AI algorithms analyze vast datasets of fashion trends, consumer preferences, and historical designs to generate unique, market-relevant concepts. This isn't about replacing human creativity – it's about augmenting it, giving designers powerful tools to explore new possibilities and iterate faster than ever before.

          Machine learning enables our platform to understand the subtle nuances of fashion design, from how different fabrics drape to how colors interact under various lighting conditions. This deep understanding allows for more accurate visualizations and better design decisions.

          The future of AI in fashion extends beyond design generation. Predictive analytics help brands forecast trends, optimize inventory, and reduce waste. Computer vision technology enables virtual try-ons and personalized shopping experiences that enhance customer satisfaction.

          As we continue to develop these technologies, we remain committed to preserving the human element that makes fashion truly special – the creativity, emotion, and personal expression that define great design.
        `,
        author: "Tech Team",
        date: "2024-01-20",
        readTime: "8 min read"
      },
      {
        title: "3D Visualization: The New Standard",
        excerpt: "Learn how 3D technology is revolutionizing fashion design, prototyping, and customer experience.",
        content: `
          Three-dimensional visualization has become an indispensable tool in modern fashion design, offering unprecedented accuracy and efficiency in the design process. TailorTech's advanced 3D rendering capabilities allow designers to see their creations in stunning detail before a single thread is sewn.

          The benefits of 3D visualization extend far beyond aesthetic appeal. Designers can test fit, drape, and movement in virtual environments, identifying potential issues early in the design process. This proactive approach saves time, reduces costs, and ensures higher quality final products.

          Our 3D technology also enables virtual try-ons, giving customers the confidence to purchase online by showing exactly how garments will look and fit. This technology bridges the gap between online and in-store shopping experiences, reducing return rates and increasing customer satisfaction.

          The precision of modern 3D rendering means that what you see in our virtual environment closely matches the final physical product. Advanced physics simulations ensure that fabric behavior, lighting effects, and even environmental factors are accurately represented.

          As 3D technology continues to evolve, we're exploring exciting new possibilities like haptic feedback, which would allow designers to "feel" digital fabrics, and augmented reality applications that could revolutionize how we shop for and interact with fashion.
        `,
        author: "3D Team",
        date: "2024-01-16",
        readTime: "6 min read"
      },
      {
        title: "The Future of Virtual Fashion Shows",
        excerpt: "Discover how virtual runway shows are changing the fashion industry and creating new opportunities for designers.",
        content: `
          The fashion industry's shift toward virtual presentations has opened up exciting new possibilities for creativity and accessibility. Virtual fashion shows aren't just a temporary solution – they represent a fundamental evolution in how fashion is presented and consumed.

          TailorTech's virtual runway feature allows designers to showcase their collections in immersive 3D environments that would be impossible or prohibitively expensive to create physically. From underwater scenes to futuristic cityscapes, the only limit is imagination.

          These digital presentations offer several advantages over traditional runway shows. They're more accessible to global audiences, environmentally friendly, and allow for creative presentations that enhance the storytelling aspect of fashion collections. Designers can control every aspect of the experience, from lighting and music to camera angles and special effects.

          Virtual shows also democratize fashion week, allowing emerging designers to present their collections alongside established brands without the massive costs associated with physical runway shows. This levels the playing field and encourages innovation from designers who might not otherwise have the opportunity to showcase their work.

          The data and analytics available from virtual shows provide valuable insights into audience engagement, helping designers understand which pieces resonate most with viewers. This feedback loop enables continuous improvement and more targeted future collections.

          As technology continues to advance, we anticipate even more immersive experiences, including interactive elements that allow viewers to customize garments in real-time and virtual reality presentations that make audiences feel like they're sitting front row at fashion week.
        `,
        author: "Innovation Team",
        date: "2024-01-05",
        readTime: "7 min read"
      }
    ]
  }
];

const BlogSection = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  const openBlog = (blog) => {
    setSelectedBlog(blog);
    setSelectedArticle(null);
  };

  const openArticle = (article) => {
    setSelectedArticle(article);
  };

  const closeModal = () => {
    setSelectedBlog(null);
    setSelectedArticle(null);
  };

  return (
    <section className="min-h-screen bg-white text-black py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          className="text-5xl md:text-7xl font-extrabold text-center mb-20 tracking-tight uppercase bg-clip-text text-transparent bg-gradient-to-r from-black to-gray-400 drop-shadow-lg"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Explore Topics
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.id}
              id={blog.id}
              className="relative h-[80vh] rounded-3xl overflow-hidden shadow-xl group cursor-pointer perspective-1000"
              initial={{ opacity: 0, rotateY: 30, y: 50 }}
              whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              whileHover={{
                scale: 1.03,
                rotateY: 5,
                transition: { duration: 0.4 },
              }}
              onClick={() => openBlog(blog)}
            >
              {/* Background Image with Light Grey Tint */}
              <img
                src={blog.image}
                alt={blog.category}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-115 brightness-75"
              />
              {/* Light Grey Overlay */}
              <div className="absolute inset-0 bg-gray-300/30 mix-blend-overlay"></div>

              {/* Content Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex flex-col items-center justify-center text-center transition-all duration-500 group-hover:bg-black/70 p-6">
                <motion.h3
                  className="text-4xl md:text-5xl font-bold uppercase tracking-widest text-white drop-shadow-md mb-4"
                  initial={{ y: 20, opacity: 0.8 }}
                  whileHover={{
                    y: 0,
                    opacity: 1,
                    textShadow: "0 0 20px rgba(255, 255, 255, 0.9)",
                    transition: { duration: 0.3 },
                  }}
                >
                  {blog.category}
                </motion.h3>
                <motion.p
                  className="text-lg md:text-xl font-medium text-gray-300 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ y: 30 }}
                  whileHover={{ y: 0, transition: { duration: 0.3 } }}
                >
                  {blog.subtitle}
                </motion.p>

                {/* Article count and preview */}
                <motion.div
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"
                  initial={{ y: 40 }}
                  whileHover={{ y: 0, transition: { duration: 0.3 } }}
                >
                  <p className="text-sm text-gray-400 mb-4">
                    {blog.articles.length} Articles Available
                  </p>
                  <div className="flex items-center text-white font-semibold">
                    <span className="mr-2">Explore Articles</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.div>
              </div>

              {/* Creative Border Effect */}
              <div className="absolute inset-0 border-2 border-transparent rounded-3xl group-hover:border-white/30 transition-all duration-500 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Blog Modal */}
      <AnimatePresence>
        {selectedBlog && !selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-900">{selectedBlog.category}</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid gap-6">
                  {selectedBlog.articles.map((article, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => openArticle(article)}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-gray-600 mb-4">{article.excerpt}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all ml-4 flex-shrink-0" />
                      </div>

                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {article.author}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(article.date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {article.readTime}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Article Modal */}
      <AnimatePresence>
        {selectedArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex-1">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{selectedArticle.title}</h1>
                    <div className="flex items-center text-gray-600 space-x-4 mb-6">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {selectedArticle.author}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(selectedArticle.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {selectedArticle.readTime}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0 ml-4"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="prose prose-lg max-w-none">
                  {selectedArticle.content.split('\n').map((paragraph, index) => (
                    paragraph.trim() && (
                      <p key={index} className="mb-6 text-gray-700 leading-relaxed">
                        {paragraph.trim()}
                      </p>
                    )
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => setSelectedArticle(null)}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full font-semibold hover:shadow-lg transition-all"
                  >
                    Back to Articles
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BlogSection;