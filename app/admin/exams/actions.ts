"use server";

import {
    deleteExam as deleteExamService,
    saveExam as saveExamService,
    searchAdminMusic as searchAdminMusicService,
} from "@/features/exams/server/examAdminService";

export async function searchAdminMusic(query: string) {
    return searchAdminMusicService(query);
}

export async function saveExam(input: unknown) {
    return saveExamService(input);
}

export async function deleteExam(examId: number) {
    return deleteExamService(examId);
}
