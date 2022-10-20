import { PrismaClient, ProposalStatus } from "@prisma/client";
import { withAuth } from "lib/auth";

const prisma = new PrismaClient();

export default withAuth(async (req, res, session) => {
  const { method } = req;

  switch (method) {
    case "GET":
      const drafts = await prisma.proposal.findMany({
        where: { status: "DRAFT" },
      });

      if (!drafts || drafts.length <= 0)
        return res.status(404).json({
          error: "Failed to return any drafts",
        });

      return res.json(drafts);
  }
});
