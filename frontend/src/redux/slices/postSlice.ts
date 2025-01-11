import { CommentType, PostType } from "@/types";
import { createSlice } from "@reduxjs/toolkit";

type postDataType = {
    comments: CommentType[],
    posts: PostType[],
    post: PostType | null,
}

const initialState: postDataType = {
    post: null,
    posts: [],
    comments: [],
}

const postSlice = createSlice({
    name: "post",
    initialState,
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload
        },
        
        resetPosts: (state) => {
            state.posts = [];
        },

        setPost: (state, action) => {
            state.post = action.payload
        },
        
        resetPost: (state) => {
            state.post = null;
        },
        
        setComments: (state, action) => {
            state.comments = action.payload
        },

        addNewComment: (state, action) => {
            state.comments = [action.payload, ...state.comments]
        },
        
        resetComments: (state) => {
            state.comments = [];
        },
    }
})

export const { addNewComment, setComments, setPost, setPosts, resetComments, resetPost, resetPosts } = postSlice.actions;

export default postSlice.reducer