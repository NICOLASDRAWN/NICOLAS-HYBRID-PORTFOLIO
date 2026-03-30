import React, { useState, useEffect } from 'react';

const bannerImages = [
    '/assets/banners/banner1.png',
    '/assets/banners/banner2.png',
    '/assets/banners/banner3.jpg',
];

const Banner: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % bannerImages.length);
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval);
    }, []);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="relative w-full h-64 md:h-96 overflow-hidden bg-slate-100 group">
            {/* Images */}
            {bannerImages.map((image, index) => (
                <div
                    key={index}
                    className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                >
                    <img
                        src={image}
                        alt={`Banner ${index + 1}`}
                        className="w-full h-full object-cover"
                    />
                    {/* Dark overlay gradient for better text readability if we add text later */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
            ))}

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
                {bannerImages.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex
                            ? 'bg-emerald-500 w-6'
                            : 'bg-white/50 hover:bg-white'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            {/* Prev/Next Arrows (Hidden on mobile, visible on hover desktop) */}
            <button
                className="hidden md:block absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-emerald-600/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() => setCurrentIndex((prev) => (prev - 1 + bannerImages.length) % bannerImages.length)}
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            <button
                className="hidden md:block absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-emerald-600/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={() => setCurrentIndex((prev) => (prev + 1) % bannerImages.length)}
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
    );
};

export default Banner;
