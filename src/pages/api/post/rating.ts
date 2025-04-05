import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check if user is authenticated
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    return res
      .status(401)
      .json({ error: "You must be signed in to rate posts." });
  }

  const { postId } = req.method === "GET" ? req.query : req.body;

  if (!postId || typeof postId !== "string") {
    return res.status(400).json({ error: "Post ID is required" });
  }

  try {
    // Get the user ID from their email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    // Handle GET request - Fetch ratings
    if (req.method === "GET") {
      const ratings = await prisma.rating.findMany({
        where: { postId },
      });

      const totalRatings = ratings.length;
      const averageRating =
        totalRatings > 0
          ? ratings.reduce((sum, rating) => sum + rating.value, 0) /
            totalRatings
          : 0;

      return res.status(200).json({
        averageRating,
        totalRatings,
      });
    }

    // Handle POST request - Submit rating
    if (req.method === "POST") {
      const { rating, text } = req.body;

      if (typeof rating !== "number" || rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ error: "Rating must be a number between 1 and 5" });
      }

      // Check if user has already rated this post
      const existingRating = await prisma.rating.findUnique({
        where: {
          postId_userId: {
            userId: user.id,
            postId,
          },
        },
      });

      if (existingRating) {
        // Update existing rating
        const updatedRating = await prisma.rating.update({
          where: {
            postId_userId: {
              userId: user.id,
              postId,
            },
          },
          data: {
            value: rating,
            text: text || null,
          },
        });
        return res.status(200).json(updatedRating);
      }

      // Create new rating
      const newRating = await prisma.rating.create({
        data: {
          value: rating,
          text: text || null,
          user: { connect: { id: user.id } },
          post: { connect: { id: postId } },
        },
      });

      return res.status(201).json(newRating);
    }

    // Handle unsupported methods
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("Rating operation failed:", error);
    return res.status(500).json({ error: "Failed to process rating" });
  }
}
