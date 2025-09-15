"use server";

import db from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function CreateUserBingoCellData(
    bingo_cell_id: number,
    user_id: number
) {
    const prev = await db.userBingoCellData.findFirst({
        where: {
            user_id: user_id,
            bingo_cell_id: bingo_cell_id,
        },
        select: {
            id: true,
        },
    });
    if (prev) {
        await db.userBingoCellData.delete({
            where: {
                id: prev.id,
            },
        });
    } else {
        await db.userBingoCellData.create({
            data: {
                bingo_cell_id,
                user_id,
                isCompleted: true,
            },
        });
    }

    revalidatePath("/bingo/[id]", "page");
}
