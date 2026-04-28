import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container } from "../components";
import parse from "html-react-parser";
import { useSelector } from "react-redux";

export default function Post() {
    const [post, setPost] = useState(null);
    const { slug } = useParams();
    const navigate = useNavigate();

    const userData = useSelector((state) => state.auth.userData);

    const isAuthor = post && userData ? post.userId === userData.$id : false;

    useEffect(() => {
        if (slug) {
            console.log("Fetching post for slug:", slug);
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    console.log("Fetched post:", post);
                    setPost(post);
                } else {
                    console.warn("No post found for slug:", slug);
                    navigate("/");
                }
            }).catch((err) => {
                console.error("Error fetching post:", err);
                navigate("/");
            });
        } else {
            console.warn("No slug provided, redirecting...");
            navigate("/");
        }
    }, [slug, navigate]);

    const deletePost = () => {
        console.log("Deleting post:", post?.$id);
        appwriteService.deletePost(post.$id).then((status) => {
            if (status) {
                console.log("Post deleted, deleting file:", post.featuredImage);
                appwriteService.deleteFile(post.featuredImage);
                navigate("/");
            }
        }).catch((err) => {
            console.error("Error deleting post:", err);
        });
    };

    // Debug image preview
    const getImagePreview = () => {
        if (!post?.featuredImage) {
            console.warn("No featuredImage found in post:", post);
            return null;
        }
        const previewUrl = appwriteService.getFilePreview(post.featuredImage);
        console.log("Preview URL generated:", previewUrl);
        return previewUrl;
    };

    return post ? (
        <div className="py-8">
            <Container>
                <div className="w-full flex justify-center mb-4 relative border rounded-xl p-2">
                    {getImagePreview() ? (
                        <img
                            src={getImagePreview()}
                            alt={post.title || "Post image"}
                            className="rounded-xl"
                            onError={(e) => {
                                console.error("Image failed to load:", getImagePreview());
                                e.target.src = "/default-thumbnail.png"; // fallback image
                            }}
                        />
                    ) : (
                        <img
                            src="/default-thumbnail.png"
                            alt="Default fallback"
                            className="rounded-xl"
                        />
                    )}

                    {isAuthor && (
                        <div className="absolute right-6 top-6">
                            <Link to={`/edit-post/${post.$id}`}>
                                <Button bgColor="bg-green-500" className="mr-3">
                                    Edit
                                </Button>
                            </Link>
                            <Button bgColor="bg-red-500" onClick={deletePost}>
                                Delete
                            </Button>
                        </div>
                    )}
                </div>
                <div className="w-full mb-6">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                </div>
                <div className="browser-css">
                    {parse(post.content)}
                </div>
            </Container>
        </div>
    ) : (
        <p className="text-center mt-8">Loading post...</p>
    );
}
