import { PrismaClient } from "@prisma/client";
import { withAuth } from "lib/auth";

const prisma = new PrismaClient();

export default withAuth(async (req, res, session) => {
  const { method, body } = req;

  switch (method) {
    case "GET":
      const proposals = await prisma.proposal.findMany();

      if (!proposals || proposals.length <= 0)
        return res.status(404).json({
          error: "No proposals found",
        });

      return res.json(proposals);

    case "POST":
      const {
        name,
        coAuthors,
        summary,
        motivation,
        specifications,
        timeline,
        risks,
        successMetrics,
      } = body;

      if (!name || !summary)
        return res.status(400).json({
          error: "Name and Summary are required fields",
        });

      const proposal = await prisma.proposal.create({
        data: {
          name,
          author: session.address as string,
          coAuthors,
          summary,
          motivation,
          specifications,
          timeline,
          risks,
          successMetrics,
        },
      });

      return res.json(proposal);

    default:
      if (!name || !summary)
        return res.status(405).json({
          error: "Method Not Allowed",
        });
  }
});
