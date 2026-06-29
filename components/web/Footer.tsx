import React from 'react'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-12 px-4 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">Jemigraph</h3>
            <p className="text-zinc-400 max-w-sm">Professional photography tours capturing your best moments worldwide with passion.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-zinc-400 text-sm">info@jemigraph.com</p>
          </div>
          <div className="flex gap-4">
            <FaInstagram className="text-2xl hover:text-emerald-400 cursor-pointer" />
            <FaFacebook className="text-2xl hover:text-emerald-400 cursor-pointer" />
            <FaTwitter className="text-2xl hover:text-emerald-400 cursor-pointer" />
          </div>
        </div>
        <div className="text-center text-zinc-500 text-xs mt-12">
          &copy; {new Date().getFullYear()} Jemigraph Photography Tours. All rights reserved.
        </div>
      </footer>
  )
}

export default Footer