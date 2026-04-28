import React from 'react'
import appwriteService from "../appwrite/config"
import { Link } from 'react-router-dom'

function PostCard({ $id, title, featuredImage }) {
  // Make sure we always get a string URL
  const imageUrl = featuredImage
    ? appwriteService.getFilePreview(featuredImage)?.href || ""
    : "https://via.placeholder.com/300"

  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full bg-gray-100 rounded-xl p-4 hover:shadow-lg transition">
        <div className="w-full flex justify-center mb-4">
          <img
            src={imageUrl}
            alt={title}
            className="rounded-xl object-cover max-h-60"
          />
        </div>
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
    </Link>
  )
}

export default PostCard
