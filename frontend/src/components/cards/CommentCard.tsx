import { CommentType } from "@/types"
import { formatDate } from "@/utilities/helper"
import Avatar from "../Avatar"
import { PiHandsClappingThin } from "react-icons/pi"

type CommentCardProps = {
    comment?: CommentType,
}

export default function CommentCard({ comment }: CommentCardProps) {

    if (!comment?.content) {
        return <div className="block space-y-4 animate-pulse">

            <div className="flex items-center gap-2">
                <Avatar />

                <div className="block w-full space-y-2">
                    <div className="w-full h-6 bg-slate-200"></div>
                    <div className="w-60 h-4 bg-slate-200"></div>
                </div>
            </div>

            <div className="w-full h-14 bg-slate-200"></div>

            <div className="w-full h-4 bg-slate-200">
                <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
            </div>
        </div>
    }

    return (
        <div className="block space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <Avatar alt={comment.author.display_name} />
                <div className="block grow w-full text-sm space-y-1">
                    <div className="font-semibold">{comment.author.display_name}</div>
                    <p className="text-gray-500 text-sm">
                        Published on {formatDate(comment.createdAt)}
                    </p>
                </div>
            </div>
            <div className="content">
                {comment.content}
            </div>
            <div className="flex items-center gap-4">
                <PiHandsClappingThin className="w-6 h-6" />
                {comment?._count?.likes || 0}
            </div>
        </div>
    )
}
