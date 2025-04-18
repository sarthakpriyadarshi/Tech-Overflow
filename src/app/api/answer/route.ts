import { databases, users } from "@/models/server/config";
import { db, answerCollection } from "@/models/name";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "appwrite";
import { UserPrefs } from "@/store/Auth";

export async function POST(request: NextRequest) {
  try {
    const { questionId, answer, authorId } = await request.json();
    console.log(questionId, answer, authorId);
    await databases.createDocument(db, answerCollection, ID.unique(), {
      content: answer,
      authorId: authorId,
      questionId: questionId,
    });
    // Increase author reputation
    const prefs = users.getPrefs<UserPrefs>(authorId);
    await users.updatePrefs<UserPrefs>(authorId, {
      reputation: Number((await prefs).reputation) + 1,
    });

    return NextResponse.json({
      status: 201,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while creating the answer.";
    const errorStatus =
      error instanceof Error &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : error instanceof Error &&
          "code" in error &&
          typeof error.code === "number"
        ? error.code
        : 500;

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: errorStatus }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { answerId } = await request.json();
    const answer = await databases.getDocument(db, answerCollection, answerId);
    const response = await databases.deleteDocument(
      db,
      answerCollection,
      answerId
    );
    const prefs = users.getPrefs<UserPrefs>(answer.authorId);
    await users.updatePrefs<UserPrefs>(answer.authorId, {
      reputation: Number((await prefs).reputation) - 1,
    });

    return NextResponse.json(
      {
        data: response,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An error occurred while deleting the answer.";
    const errorStatus =
      error instanceof Error &&
      "status" in error &&
      typeof error.status === "number"
        ? error.status
        : error instanceof Error &&
          "code" in error &&
          typeof error.code === "number"
        ? error.code
        : 500;

    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: errorStatus }
    );
  }
}
