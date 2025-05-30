import { NextRequest, NextResponse } from "next/server";

interface Todo {
    id: number,
    title: string;
    completed: boolean
};
let todos: Todo[] = []; // in-memory store (resets on server restart)
export async function GET() {
    return NextResponse.json(todos);
}
export async function POST(request: NextRequest) {
    const { action, title, id } = await request.json();

    if (action === 'add') {
        if (!title) {
            return NextResponse.json(
                { error: 'Title required' },
                { status: 400 }
            );
        }
        const newTodo: Todo = {
            id: Date.now(),
            title,
            completed: false
        };
        todos.push(newTodo);
        return NextResponse.json(newTodo, { status: 201 })
    }

    if (action === 'edit') {
        todos = todos.map(todo =>
            todo.id === id ? { ...todo, title } : todo
        )
        return NextResponse.json({ message: 'Edited' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}
export async function DELETE(request: NextRequest) {
    const { id } = await request.json();
    todos = todos.filter((todo) => todo.id !== id);
    return NextResponse.json({ message: 'Deleted' });
}
export async function PATCH(request: NextRequest) {
    const { id, completed } = await request.json();
    todos = todos.map((todo) =>
        todo.id === id
            ? { ...todo, completed }
            : todo
    )
    return NextResponse.json({ message: 'Updated' });
}