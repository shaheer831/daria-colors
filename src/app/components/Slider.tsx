"use client"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  const slides = [
    {
      title: "Modish Look",
      description: "Find Your Perfect Look by Dressing Up with Daira Colors, Get the Special Price!",
      buttonText: "SHOP COLOR SWATCHES",
      image: "/family-home.png",
      gradient: "linear-gradient(to bottom right, #F1BDC3, #a56a71)",
    },
    {
      title: "Summer Collection",
      description: "Discover our vibrant summer collection with fresh colors and modern designs for every occasion!",
      buttonText: "EXPLORE COLLECTION",
      image: "/family-home.png",
      gradient: "linear-gradient(to bottom right, #FFE5B4, #D2691E)",
    },
    {
      title: "Premium Quality",
      description: "Experience luxury with our premium quality fabrics and exclusive designs",
      buttonText: "VIEW PREMIUM LINE",
      image: "/family-home.png",
      gradient: "linear-gradient(to bottom right, #E6E6FA, #9370DB)",
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  useEffect(() => {
    if (!isDragging) {
      const interval = setInterval(() => {
        nextSlide()
      }, 4000)
      return () => clearInterval(interval)
    }
  }, [currentSlide, isDragging])

  const handleStart = (clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
  }

  const handleMove = (clientX: number) => {
    if (!isDragging) return
    const diff = clientX - startX
    setTranslateX(diff)
  }

  const handleEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 50
    if (translateX > threshold) {
      prevSlide()
    } else if (translateX < -threshold) {
      nextSlide()
    }

    setTranslateX(0)
  }

  return (
    <>
      <div className="relative w-full max-w-md mx-auto">
        <div className="relative overflow-hidden">
          <div
            ref={sliderRef}
            className="flex transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing"
            style={{
              transform: `translateX(${-currentSlide * 100 + (translateX / (sliderRef.current?.offsetWidth || 1)) * 100}%)`,
              transition: isDragging ? "none" : "transform 0.5s ease-in-out",
            }}
            onMouseDown={(e) => handleStart(e.clientX)}
            onMouseMove={(e) => handleMove(e.clientX)}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
            onTouchStart={(e) => handleStart(e.touches[0].clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
            onTouchEnd={handleEnd}
          >
            {slides.map((slide, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <span
                  style={{
                    display: "inline-block",
                    background: slide.gradient,
                  }}
                  className="w-full rounded-4xl mt-5 text-white overflow-hidden h-[480px] flex flex-col"
                >
                  <div className="w-full px-5 pt-7 flex-1 flex flex-col">
                    <p className="font-Sen text-4xl">{slide.title}</p>
                    <p className="font-Sen text-[18px] mt-2.5 tracking-wider w-[90%] leading-[1.3] flex-1">
                      {slide.description}
                    </p>
                    <button className="bg-black px-8 mt-4 mb-4 py-3 rounded-full text-[17px] self-start">
                      {slide.buttonText}
                    </button>
                  </div>
                  <div className="w-full h-[280px] relative overflow-hidden">
                    <Image
                      src={slide.image || "/placeholder.svg"}
                      alt="slide-image"
                      fill
                      className="object-cover scale-[1.02]"
                    />
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-1 mt-1">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3.5 h-3.5 rounded-full transition-colors ${
              currentSlide === index ? "bg-gray-800" : "bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </>
  )
}

export default function Home() {
  return (
    <main className="py-8">
      <div className="container mx-auto">
        <Slider />
      </div>
    </main>
  )
}
