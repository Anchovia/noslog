import Input from "@/components/input";

export default async function ProfileSettings() {
    //
    return (
        <form className="h-screen w-screen flex flex-col items-center justify-center max-w-sm mx-auto gap-3 *:w-full ">
            <label></label>
            <input className="hidden" type="file"></input>
            <Input name="username" type="text" />
            <div className="flex">
                <Input name="discord_tag" type="text" />
                <Input name="discord_tag" type="text" />
            </div>

            <button className="py-2.5 bg-dark-tertiary">업데이트</button>
        </form>
    );
}
