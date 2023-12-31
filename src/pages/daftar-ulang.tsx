import {
    Card,
    Input,
    Button,
    Typography,
    Avatar,
    Dialog,
    DialogHeader,
    DialogBody,
    Spinner,
    Alert,
} from "@material-tailwind/react"
import { InfoRounded } from "@mui/icons-material"
import { signIn, useSession } from "next-auth/react"
import { type FormEvent, useState } from "react"
import { z } from "zod"
import { api } from "~/utils/api"

const formDataSchema = z.object({
    name: z.string().nonempty(),
    nim: z.string().nonempty(),
})

type FormData = z.infer<typeof formDataSchema>

export default function DaftarUlang() {
    const { data: sessionData, status: authStatus } = useSession()

    const [formData, setFormData] = useState<FormData>({
        name: "",
        nim: "",
    })

    const [successDialogOpen, setSuccessDialogOpen] = useState(false)

    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)

    const submitFormMutation = api.reregistrationRouter.submit.useMutation({
        onSuccess(_data, _variables, _context) {
            setSuccessDialogOpen(true)
            setConfirmationDialogOpen(false)
        },
    })

    function isValidNim(str: string) {
        return (
            str.length === 10 &&
            (str.startsWith("24") ||
                str.startsWith("25") ||
                str.startsWith("26") ||
                str.startsWith("27")) &&
            Array.from(str).every((char) => char >= "0" && char <= "9")
        )
    }

    function isValidName(str: string) {
        return str !== ""
    }

    function isValidFormData(input: FormData) {
        return isValidName(input.name) && isValidNim(input.nim)
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (submitFormMutation.isLoading) {
            return
        }

        const data = { ...Object.fromEntries(new FormData(event.target as HTMLFormElement)) }
        const parseResult = formDataSchema.safeParse(data)

        if (!parseResult.success) {
            return
        }

        if (!isValidFormData(parseResult.data)) {
            return
        }

        if (sessionData === null) {
            return
        }

        setConfirmationDialogOpen(true)
    }

    function handleSuccessDialog() {
        //
    }

    function handleConfirmDialog() {
        //
    }

    function handleConfirmSubmit() {
        submitFormMutation.mutate({
            fullName: formData.name,
            nim: formData.nim,
            discordUserName: sessionData?.user.name ?? "NO_USERNAME_FOUND",
            discordUserId: sessionData?.user.id ?? "NO_USERID_FOUND",
        })
    }

    return (
        <>
            <main
                className={`flex min-h-screen w-full min-w-[400px] flex-col items-center bg-magenta py-5`}
            >
                <Dialog open={confirmationDialogOpen} size="xs" handler={handleConfirmDialog}>
                    <DialogHeader>
                        <Typography variant="h4" className="w-full text-center">
                            Is this correct?
                        </Typography>
                    </DialogHeader>
                    <DialogBody divider>
                        <ul className="flex w-full flex-col items-start gap-2">
                            <Typography as="li">
                                {`Full Name: `}
                                <span className="font-semibold">{`${formData.name}`}</span>
                            </Typography>
                            <Typography as="li">
                                {`NIM: `}
                                <span className="font-semibold">{`${formData.nim}`}</span>
                            </Typography>
                            <Typography as="li">
                                {`Discord Username: `}
                                <span className="font-semibold">{`${sessionData?.user.name}`}</span>
                            </Typography>
                        </ul>
                        <br />
                        {submitFormMutation.isLoading ? (
                            <div className="flex items-center justify-center p-1">
                                <Spinner color="orange" className="h-14 w-14" />
                            </div>
                        ) : (
                            <>
                                <Button
                                    fullWidth
                                    color="green"
                                    size="lg"
                                    onClick={handleConfirmSubmit}
                                >
                                    {"Yes, I'm Sure (Submit)"}
                                </Button>
                                <br />
                                <Button
                                    fullWidth
                                    color="deep-orange"
                                    size="lg"
                                    onClick={() => setConfirmationDialogOpen(false)}
                                >
                                    {"Wait, go back"}
                                </Button>
                            </>
                        )}
                    </DialogBody>
                </Dialog>
                <Card
                    className="flex w-[90vw] min-w-[350px] max-w-md flex-col items-center bg-white p-5"
                    color="transparent"
                    shadow={false}
                >
                    <Typography variant="h3" color="blue-gray" className="font-serif">
                        Confirm Registration
                    </Typography>
                    {authStatus === "authenticated" && sessionData !== null ? (
                        <>
                            <div className="flex flex-col items-center">
                                <div className="my-2 flex flex-row items-center justify-center gap-2">
                                    <Avatar src={sessionData?.user?.image ?? ""}></Avatar>
                                    <Typography variant="small">
                                        {sessionData?.user?.name ?? ""}
                                    </Typography>
                                </div>
                                <Button variant="text" onClick={() => void signIn("discord")}>
                                    Not You? Sign In Again
                                </Button>
                            </div>
                            <Alert
                                icon={<InfoRounded />}
                                variant="filled"
                                color="blue"
                                className="my-2"
                            >
                                <Typography variant="small" className="text-xs">
                                    We need your Discord Username and ID to verify you on our
                                    Discord server.
                                </Typography>
                            </Alert>
                            <form
                                method="post"
                                onSubmit={handleSubmit}
                                className="mb-2 mt-4 w-80 max-w-screen-lg sm:w-96"
                            >
                                <div className="mb-4 flex flex-col gap-6">
                                    <Input
                                        name="name"
                                        variant="static"
                                        size="md"
                                        label="Full Name*"
                                        error={!isValidName(formData.name) && formData.name !== ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                            })
                                        }
                                    />
                                    <Input
                                        name="nim"
                                        variant="static"
                                        size="md"
                                        label="NIM*"
                                        error={!isValidNim(formData.nim) && formData.nim !== ""}
                                        onChange={(e) =>
                                            setFormData({
                                                ...formData,
                                                nim: e.target.value,
                                            })
                                        }
                                    />
                                </div>
                                <Button
                                    color={isValidFormData(formData) ? "orange" : "gray"}
                                    disabled={!isValidFormData(formData)}
                                    type="submit"
                                    className="mt-6"
                                    fullWidth
                                >
                                    Complete My Registration
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="p-5">
                            {authStatus === "unauthenticated" ? (
                                <div className="w-full">
                                    <Button
                                        fullWidth
                                        color="teal"
                                        onClick={() => void signIn("discord")}
                                    >
                                        To continue, please sign in with Discord
                                    </Button>
                                    <Alert
                                        icon={<InfoRounded />}
                                        variant="filled"
                                        color="blue"
                                        className="my-2"
                                    >
                                        <Typography variant="small" className="text-xs">
                                            This is because we need your Discord Username and ID to
                                            verify you on our Discord server.
                                        </Typography>
                                    </Alert>
                                </div>
                            ) : (
                                <Spinner className="h-16 w-16" />
                            )}
                        </div>
                    )}
                </Card>
            </main>
            <Dialog
                open={successDialogOpen}
                handler={handleSuccessDialog}
                className="bg-magenta py-5"
            >
                <DialogHeader>
                    <Typography variant="h4" className="w-full text-center text-white">
                        {" "}
                        Registration Complete!{" "}
                    </Typography>{" "}
                </DialogHeader>
                <DialogBody className="flex flex-col items-center gap-5">
                    <div className="flex max-w-lg flex-col items-center">
                        <Typography
                            color="white"
                            variant="small"
                            className="text-md text-center lg:text-lg"
                        >
                            {`Thank you! We're validating the data you sent.`}
                        </Typography>
                        <br />
                        <Typography
                            color="white"
                            variant="small"
                            className="text-md text-center lg:text-lg"
                        >
                            {`Access to the server will be given out every day at 9AM and 9PM WIB, so stay tuned!`}
                        </Typography>
                        <br />
                        <Typography
                            color="white"
                            variant="small"
                            className="text-md text-center lg:text-lg"
                        >
                            {`Meanwhile, please make sure to join the BGDC discord server below:`}
                        </Typography>
                    </div>
                    <Button color="orange">
                        <a href="https://binusgdc.com/Discord">Take me to BGDC Server</a>
                    </Button>
                </DialogBody>
            </Dialog>
        </>
    )
}
