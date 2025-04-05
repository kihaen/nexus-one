import { GetServerSideProps } from "next";
import { useSession } from "next-auth/react";
import Layout from "@/components/Layout";
import Image from "next/image";
import prisma from "../../../lib/prisma";
import { Post } from "@prisma/client";
import Style from "../../styles/Profile.module.scss";
import { RatingComponent } from "@/components/Rating";
import { useState } from "react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]";
import ProtectedRoute from "@/components/ProtectedRoute";

type ProfileProps = {
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    about: string | null;
  };
  posts: Post[];
  ratings: {
    id: string;
    value: number;
    text: string | null;
    postId: string;
    createdAt: string;
    post: {
      title: string;
      description: string | null;
    };
  }[];
  isOwner: boolean;
};

export default function Profile({
  user,
  posts,
  ratings,
  isOwner,
}: ProfileProps) {
  const { data: session } = useSession();
  const [about, setAbout] = useState(user.about || "");
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdateAbout = async () => {
    try {
      await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ about }),
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update about:", error);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className={Style.profileContainer}>
          <div className={Style.profileHeader}>
            <div className={Style.userInfo}>
              {user.image ? (
                <Image
                  src={user.image}
                  alt={user.name || "Profile"}
                  width={120}
                  height={120}
                  className={Style.profileImage}
                />
              ) : (
                <div className={Style.profileImagePlaceholder}>
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className={Style.userDetails}>
                <h1>{user.name}</h1>
                {isOwner && isEditing ? (
                  <div className={Style.aboutEdit}>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      placeholder="Tell us about yourself..."
                    />
                    <div className={Style.editButtons}>
                      <button onClick={handleUpdateAbout}>Save</button>
                      <button onClick={() => setIsEditing(false)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <div className={Style.about}>
                    <p>{user.about || "No bio yet."}</p>
                    {isOwner && (
                      <button onClick={() => setIsEditing(true)}>
                        {user.about ? "Edit Bio" : "Add Bio"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={Style.contentSection}>
            <h2>Published Posts</h2>
            <div className={Style.postsGrid}>
              {posts.map((post) => (
                <div key={post.id} className={Style.postCard}>
                  {post.coverImg && (
                    <Image
                      src={post.coverImg}
                      alt={post.title}
                      width={300}
                      height={200}
                      className={Style.postImage}
                    />
                  )}
                  <div className={Style.postInfo}>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <RatingComponent postId={post.id} />
                  </div>
                </div>
              ))}
            </div>

            <h2>Reviews</h2>
            <div className={Style.reviewsGrid}>
              {ratings.map((rating) => (
                <div key={rating.id} className={Style.reviewCard}>
                  <h3>{rating.post.title}</h3>
                  <p>{rating.post.description}</p>
                  <div className={Style.rating}>
                    <div className={Style.stars}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`${Style.star} ${
                            star > rating.value ? Style.empty : ""
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    {rating.text && (
                      <p className={Style.reviewText}>{rating.text}</p>
                    )}
                    <div className={Style.reviewDate}>
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
  res,
}) => {
  const session = await getServerSession(req, res, authOptions);
  const userId = params?.id as string;

  if (!userId) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        about: true,
      },
    });

    if (!user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        published: true,
      },
    });

    const ratings = await prisma.rating.findMany({
      where: {
        userId: userId,
      },
      include: {
        post: {
          select: {
            title: true,
            description: true,
          },
        },
      },
    });

    // Convert Date objects to ISO strings for serialization
    const serializedRatings = ratings.map((rating) => ({
      ...rating,
      createdAt: rating.createdAt.toISOString(),
    }));

    return {
      props: {
        user,
        posts,
        ratings: serializedRatings,
        isOwner: session?.user?.id === userId,
      },
    };
  } catch (error) {
    console.error('Error fetching profile:', error);
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
};
