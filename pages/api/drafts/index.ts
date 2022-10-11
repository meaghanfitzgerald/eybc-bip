import { PrismaClient, ProposalStatus } from "@prisma/client";
import { withAuth } from "lib/auth";

const prisma = new PrismaClient();

export default withAuth(async (req, res, session) => {
  const { method, body } = req;

  switch (method) {
    case "GET":
      const drafts = await prisma.proposal.findMany({
        where: { status: "DRAFT" },
      });
      return res.json(drafts);
  }
});
