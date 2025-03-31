import prisma from '../../../../lib/prisma';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb' // Increased from default 1MB to 10MB
    }
  }
};

// PUT /api/publish/:id
export default async function handle(req, res) {
  const postId = req.query.id;
  const post = await prisma.post.update({
    where: { id: postId },
    data: { published: true, ...req.body },
  });
  res.json(post);
}