import { prisma } from "db"

const ONRAMP_AMOUNT = 1000;

export abstract class PaymentsService {

    static async onramp(userId: number) {
        const [user] = await prisma.$transaction([
            prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    credits: {
                        increment: ONRAMP_AMOUNT
                    }
                }
            }),
            prisma.onrampTransaction.create({
                data: {
                    userId,
                    amount: ONRAMP_AMOUNT,
                    status: "completed"
                }
            })
        ])

        return user.credits;
    }

	static async getBalance(userId: number) {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { credits: true },
		});

		return user?.credits ?? 0;
	}
}
