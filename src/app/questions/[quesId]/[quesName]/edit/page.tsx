import { db, questionCollection } from "@/models/name";
import { databases } from "@/models/server/config";
import EditQues from "./EditQues";

const Page = async ({
  params,
}: {
  params: { quesId: string; quesName: string };
}) => {
  const question = await databases.getDocument(
    db,
    questionCollection,
    params.quesId
  );

  return <EditQues question={question} />;
};

export default Page;
