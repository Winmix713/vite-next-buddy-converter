
import { Card } from "@/components/ui/card";

const ConversionSteps = () => {
  const steps = [
    {
      title: "package.json frissítése",
      description: "A Next.js függőségek eltávolítása és a Vite hozzáadása",
      example: `{
  "dependencies": {
    - "next": "^12.0.0",
    + "react": "^18.0.0",
    + "react-dom": "^18.0.0",
  },
  "devDependencies": {
    + "vite": "^5.0.0",
    + "@vitejs/plugin-react": "^4.2.0"
  },
  "scripts": {
    - "dev": "next dev",
    - "build": "next build",
    + "dev": "vite",
    + "build": "vite build",
    + "preview": "vite preview"
  }
}`
    },
    {
      title: "_app.js/.tsx konvertálása",
      description: "Az alkalmazás belépési pontjának átalakítása Next.js-ről Vite-ra",
      example: `// Next.js _app.js
import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp

// Vite App.jsx
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App`
    },
    {
      title: "Routing létrehozása",
      description: "Next.js fájlalapú routing helyett React Router implementálása",
      example: `// Next.js pages/about.tsx
export default function About() {
  return <h1>About Page</h1>
}

// Vite with React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}`
    },
    {
      title: "API Route-ok kezelése",
      description: "Next.js API route-ok áthelyezése különálló backend szolgáltatásba",
      example: `// Next.js pages/api/users.js
export default function handler(req, res) {
  res.status(200).json({ users: ['John', 'Jane'] })
}

// Vite + Backend (Express.js) megoldás
// server.js
const express = require('express')
const app = express()

app.get('/api/users', (req, res) => {
  res.json({ users: ['John', 'Jane'] })
})

app.listen(3001)`
    },
    {
      title: "Data Fetching konvertálása",
      description: "Next.js getStaticProps/getServerSideProps konvertálása React horgokra",
      example: `// Next.js data fetching
export async function getStaticProps() {
  const res = await fetch('https://api.example.com/data')
  const data = await res.json()
  return { props: { data } }
}

// Vite with React hooks
import { useState, useEffect } from 'react'

function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    async function fetchData() {
      const res = await fetch('https://api.example.com/data')
      const data = await res.json()
      setData(data)
    }
    fetchData()
  }, [])
  
  if (!data) return <div>Loading...</div>
  // ...
}`
    },
    {
      title: "Next.js specifikus komponensek cseréje",
      description: "Next.js Image, Link komponensek cseréje standard vagy más könyvtárbeli megfelelőkre",
      example: `// Next.js komponensek
import Image from 'next/image'
import Link from 'next/link'

// Next.js kód
<Image src="/image.jpg" width={500} height={300} />
<Link href="/about">About</Link>

// Vite verzió
<img src="/image.jpg" width="500" height="300" />
<Link to="/about">About</Link> // react-router-dom`
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Konverziós folyamat</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            </div>
            <div className="border-t bg-gray-50">
              <pre className="overflow-x-auto p-4 text-xs font-mono">
                <code>{step.example}</code>
              </pre>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConversionSteps;
