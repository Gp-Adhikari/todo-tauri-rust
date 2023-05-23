// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use tauri::State;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[derive(Clone)]

struct Todo {
    id: usize,
    todo: String
}

#[tauri::command]
fn get_todo(todo: String, state: State<Mutex<Vec<Todo>>>) -> Vec<Todo> {
    let mut todo_list = state.lock().unwrap();

    let new_todo = Todo {
        id: todo_list.len() + 1,
        todo
    };

    todo_list.push(new_todo);

    return todo_list.clone();
}

#[tauri::command]
fn remove_todo(id: usize, state: State<Mutex<Vec<Todo>>>) -> Vec<Todo> {
    let mut todo_list = state.lock().unwrap();

    if let Some(index) = todo_list.iter().position(|item| item.id == id) {
        todo_list.remove(index);
    }

    return todo_list.clone();
}

fn main() {
    let todo_list: Mutex<Vec<Todo>> = Mutex::new(Vec::new());

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_todo, remove_todo])
        .manage(todo_list)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}