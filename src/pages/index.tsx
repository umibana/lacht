import { type NextPage } from "next";
import Head from "next/head";
import { SignIn, SignInButton, useUser, SignOutButton } from "@clerk/nextjs";

import { RouterOutputs, api } from "~/utils/api";

const CreatePostWizard = () => {
  const { user } = useUser();
  if (!user) return null;

  return (
    <div className="flex gap-4">
      <img
        src={user.profileImageUrl}
        alt="Profile image"
        className="h-24 w-24 rounded-full"
      />
      <input
        placeholder="Escribe algo!"
        className="grow bg-transparent outline-none"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];

const PostView = (props: PostWithUser) => {
  const { post, author } = props;
  return (
    <div key={post.id} className="flex border-b border-slate-300 p-4">
      <img src={author.profilePicture} className="h-24 w-24 rounded-full" />
      <div className="flex flex-col p-4 ">
        <div className="between flex">
          <span>{`@${author.username}`}</span>
        </div>
        {post.content}{" "}
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();
  console.log(user);

  const { data, isLoading } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Cargando...</div>;
  if (!data) return <div>Oops! Algo salio mal.</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center ">
        <div className="w-full border-x border-slate-200 md:max-w-2xl">
          <div className="border-b border-slate-200 p-4">
            {!user.isSignedIn && <SignInButton />}
            {!!user.isSignedIn && <CreatePostWizard />}
          </div>
          <div>
            {data?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>

        <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
      </main>
    </>
  );
};

export default Home;
