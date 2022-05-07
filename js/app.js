(function (window) {
	'use strict';

	// 声明对象存储所有用于进行事项类别筛选的函数
	let filters = {
		all(todos) {
			return todos;
		},
		active(todos) {
			return todos.filter(todo => !todo.completed);
		},
		completed(todos) {
			return todos.filter(todo => todo.completed);
		}

	};
	const TODOS_KEY = 'todos_vue';
	// 声明对象统一保存本地存储的处理功能
	let todoStorage = {
		// 读取本地存储数据
		get() {
			return JSON.parse(localStorage.getItem(TODOS_KEY)) || [];
		},
		// 用于更新本地存储数据
		set(todos) {
			localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
		}
	}

	// Your starting point. Enjoy the ride!
	new Vue({
		el: '#app',
		data: {
			// todos: [
			// 	{ id: 1, title: '实例内容1', completed: true },
			// 	{ id: 2, title: '实例内容2', completed: false },
			// 	{ id: 3, title: '实例内容3', completed: false },

			// ],
			todos: todoStorage.get(),
			// 存储新增输入框数据
			newTodo: "",
			// 正在编辑的todo
			editingTodo: null,
			// todo 原始内容
			titleBeforeEdit: "",
			// 存储要显示的类别
			todoType: "all",
		},
		watch:{
			todos:{
				deep:true,
				handler:todoStorage.set
			}
		},
		computed: {
			// 用于惊醒事项筛选处理
			filteredTodo() {
				return filters[this.todoType](this.todos);
			},
			// 用于获取待办事项的个数
			remaining() {
				// return this.todos.filter(todo => !todo.completed).length;
				return filters['active'](this.todos).length;
				// return this.todos.filter(function (todo) {
				// 	return !todo.completed;
				// }).length;
			},
			// allDone(){
			// 	return this.remaining===0;
			// }
			// 用于设置全部切换选框状态
			allDone: {
				get() {
					return this.remaining === 0;
				},
				set(value) {
					// value代表全部切换选框的值
					this.todos.forEach(todo => {
						todo.completed = value;
					});
				}
			}
		},
		methods: {
			// 用于进行单位复数化处理
			pluralize(word) {
				return word + (this.remaining === 1 ? '' : 's');
			},
			// 新增
			addTodo() {
				var value = this.newTodo;
				if (!value) {
					return;
				}
				this.todos.push({ id: this.todos.length + 1, title: value, completed: false });
				this.newTodo = '';
			},
			// 删除单个事项
			removeTodo(todo) {
				var index = this.todos.indexOf(todo);
				this.todos.splice(index, 1);
			},
			// 删除已完成事项
			removeCompleted() {
				this.todos = filters.active(this.todos);
				// this.todos = this.todos.filter(todo => !todo.completed);
			},
			// 用于出发编辑，保存相关信息
			editTodo(todo) {
				this.editingTodo = todo;
				this.titleBeforeEdit = todo.title;
			},
			// 用于取消编辑，还原状态与内容
			cancelEdit(todo) {
				this.editingTodo = null;
				todo.title = this.titleBeforeEdit;
			},
			// 保存编辑
			editDone(todo) {
				if (!this.editingTodo) return;
				//应用enter的同时会失去焦点，导致删除两次，一次是删除当前项，一次是删除最后一项，添加if判断
				this.editingTodo = null;
				todo.title = todo.title.trim();
				if (!todo.title) {
					this.removeTodo(todo);
				}
			}

		},
		directives: {
			// 用于设置正在编辑的事项输入框获取焦点
			'todo-focus'(el, binding) {
				console.log(binding.value);
				if (binding.value) {
					el.focus();
				}
			}
		},
	});


})(window);
