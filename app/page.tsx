"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function SplashPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogin = () => {
    setLoading(true)
    // Simulate login
    setTimeout(() => {
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/placeholder.svg?height=1080&width=1920"
          alt="Travel background"
          fill
          className="object-cover brightness-[0.35]"
          priority
        />
      </div>

      {/* Content */}
      <div className="z-10 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="mb-2 font-sans text-5xl font-bold tracking-tight text-white sm:text-7xl">TRAVELCAST</h1>
        <p className="mb-8 text-lg text-gray-200 sm:text-xl">Want a getaway? Let&apos;s pack!</p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button
            variant="outline"
            size="lg"
            className="min-w-[150px] border-white bg-transparent text-white hover:bg-white hover:text-black"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Loading..." : "Log In"}
          </Button>
          <Button size="lg" className="min-w-[150px] bg-white text-black hover:bg-gray-200">
            Sign Up <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}