import Database from 'better-sqlite3';

export function seedContent(db: Database.Database) {
	const getAllTagsStmt = db.prepare(`
    SELECT id, slug FROM tags
  `);

	const insertContentStmt = db.prepare(`
    INSERT INTO content (title, type, body, rendered_body, slug, description, children, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING id
  `);

	const insertContentTagStmt = db.prepare(`
    INSERT INTO content_to_tags (content_id, tag_id)
    VALUES (?, ?)
  `);
	const insetContentUserStmt = db.prepare(`
	INSERT INTO content_to_users (content_id, user_id)
	SELECT content.id as content_id, 1 as user_id FROM content
	`);
	const tagIds = getAllTagsStmt.all() as Array<{ slug: string; id: string }>;

	const tagMap = new Map(tagIds.map((tag) => [tag.slug, tag.id]));

	const contentItems = [
		{
			title: 'Introduction to Svelte 5',
			type: 'recipe',
			body: `# Introduction to Svelte 5
      
      Svelte 5 introduces a revolutionary concept called runes, which fundamentally changes how we handle reactivity in Svelte applications. This major update brings significant improvements in performance and developer experience.
      
      ## What are Runes?
      
      Runes are special symbols that allow developers to explicitly declare reactive values and dependencies. They provide a more fine-grained control over reactivity, enabling more efficient updates and easier reasoning about data flow in your application.
      
      ### Key Runes
      
      - \`$state\`: Declares a reactive state variable
      - \`$derived\`: Computes a value based on other reactive values
      - \`$effect\`: Runs side effects when dependencies change
      
      ## Benefits of Svelte 5
      
      1. Improved performance through more efficient updates
      2. Enhanced developer experience with explicit reactivity
      3. Better tooling support for static analysis
      
      In the following sections, we'll dive deeper into these concepts and explore how to leverage them in your Svelte applications.`,
			rendered_body: `<h1>Introduction to Svelte 5</h1>

<p>Svelte 5 introduces a revolutionary concept called runes, which fundamentally changes how we handle reactivity in Svelte applications. This major update brings significant improvements in performance and developer experience.</p>

<h2>What are Runes?</h2>

<p>Runes are special symbols that allow developers to explicitly declare reactive values and dependencies. They provide a more fine-grained control over reactivity, enabling more efficient updates and easier reasoning about data flow in your application.</p>

<h3>Key Runes</h3>

<ul>
<li><code>$state</code>: Declares a reactive state variable</li>
<li><code>$derived</code>: Computes a value based on other reactive values</li>
<li><code>$effect</code>: Runs side effects when dependencies change</li>
</ul>

<h2>Benefits of Svelte 5</h2>

<ol>
<li>Improved performance through more efficient updates</li>
<li>Enhanced developer experience with explicit reactivity</li>
<li>Better tooling support for static analysis</li>
</ol>

<p>In the following sections, we'll dive deeper into these concepts and explore how to leverage them in your Svelte applications.</p>`,
			slug: 'introduction-to-svelte-5',
			description: 'Learn about the new features in Svelte 5',
			tags: [tagMap.get('svelte-5'), tagMap.get('runes')]
		},
		{
			title: 'Understanding Runes in Svelte 5',
			type: 'recipe',
			body: `# Understanding Runes in Svelte 5
          
          Runes are a new way to handle reactivity in Svelte 5, offering developers more control and flexibility in managing state and side effects. This article will provide a comprehensive overview of runes and how to use them effectively in your Svelte applications.
          
          ## The Philosophy Behind Runes
          
          Svelte has always been about simplifying the development of reactive user interfaces. With runes, Svelte takes this philosophy a step further by making reactivity more explicit and giving developers fine-grained control over how their application responds to changes.
          
          ## Core Runes
          
          ### $state
          
          The \`$state\` rune is used to declare reactive state variables. Unlike previous versions of Svelte, where reactivity was implicit, \`$state\` makes it clear which values are meant to be reactive.
          
          \`\`\`javascript
          let count = $state(0);
          \`\`\`
          
          ### $derived
          
          \`$derived\` is used to compute values based on other reactive values. It's similar to computed properties in other frameworks.
          
          \`\`\`javascript
          let double = $derived(count * 2);
          \`\`\`
          
          ### $effect
          
          The \`$effect\` rune is used for running side effects when dependencies change. It's similar to the \`useEffect\` hook in React, but with automatic dependency tracking.
          
          \`\`\`javascript
          $effect(() => {
            console.log(\`The count is now \${count}\`);
          });
          \`\`\`
          
          ## Advanced Usage
          
          We'll explore more advanced usage of runes, including:
          
          - Combining multiple runes
          - Using runes with async operations
          - Optimizing performance with fine-grained reactivity
          
          Stay tuned for deep dives into each of these topics!`,
			rendered_body: `<h1>Understanding Runes in Svelte 5</h1>
  
  <p>Runes are a new way to handle reactivity in Svelte 5, offering developers more control and flexibility in managing state and side effects. This article will provide a comprehensive overview of runes and how to use them effectively in your Svelte applications.</p>
  
  <h2>The Philosophy Behind Runes</h2>
  
  <p>Svelte has always been about simplifying the development of reactive user interfaces. With runes, Svelte takes this philosophy a step further by making reactivity more explicit and giving developers fine-grained control over how their application responds to changes.</p>
  
  <h2>Core Runes</h2>
  
  <h3>$state</h3>
  
  <p>The <code>$state</code> rune is used to declare reactive state variables. Unlike previous versions of Svelte, where reactivity was implicit, <code>$state</code> makes it clear which values are meant to be reactive.</p>
  
  <pre><code class="language-javascript">let count = $state(0);
  </code></pre>
  
  <h3>$derived</h3>
  
  <p><code>$derived</code> is used to compute values based on other reactive values. It's similar to computed properties in other frameworks.</p>
  
  <pre><code class="language-javascript">let double = $derived(count * 2);
  </code></pre>
  
  <h3>$effect</h3>
  
  <p>The <code>$effect</code> rune is used for running side effects when dependencies change. It's similar to the <code>useEffect</code> hook in React, but with automatic dependency tracking.</p>
  
  <pre><code class="language-javascript">$effect(() => {
    console.log(\`The count is now \${count}\`);
  });
  </code></pre>
  
  <h2>Advanced Usage</h2>
  
  <p>We'll explore more advanced usage of runes, including:</p>
  
  <ul>
  <li>Combining multiple runes</li>
  <li>Using runes with async operations</li>
  <li>Optimizing performance with fine-grained reactivity</li>
  </ul>
  
  <p>Stay tuned for deep dives into each of these topics!</p>`,
			slug: 'understanding-runes-svelte-5',
			description: "Deep dive into Svelte 5's runes",
			tags: [tagMap.get('svelte-5'), tagMap.get('runes')]
		},
		{
			title: '5 Useful Svelte Snippets',
			type: 'recipe',
			body: `# 5 Useful Svelte Snippets
          
          Here are 5 Svelte snippets that will boost your productivity and help you write cleaner, more efficient code. These snippets are compatible with Svelte 5 and take advantage of the new runes system where applicable.
          
          ## 1. Reactive Local Storage
          
          This snippet creates a reactive wrapper around localStorage, allowing you to easily sync state with browser storage.
          
          \`\`\`javascript
          function persistentState(key, initialValue) {
            let value = $state(JSON.parse(localStorage.getItem(key)) ?? initialValue);
            
            $effect(() => {
              localStorage.setItem(key, JSON.stringify(value));
            });
          
            return value;
          }
          
          // Usage
          let count = persistentState('count', 0);
          \`\`\`
          
          ## 2. Debounced Input
          
          This snippet creates a debounced input component, useful for search inputs or any scenario where you want to limit the frequency of updates.
          
          \`\`\`svelte
          <script>
            export let value = '';
            export let delay = 300;
          
            let inputValue = $state(value);
            let timeoutId;
          
            $effect(() => {
              clearTimeout(timeoutId);
              timeoutId = setTimeout(() => {
                value = inputValue;
              }, delay);
            });
          </script>
          
          <input bind:value={inputValue} />
          \`\`\`
          
          ## 3. Infinite Scroll
          
          This snippet implements a basic infinite scroll functionality, loading more items as the user scrolls to the bottom of the page.
          
          \`\`\`svelte
          <script>
            let items = $state([]);
            let loading = $state(false);
            let page = $state(1);
          
            async function loadMore() {
              loading = true;
              const newItems = await fetchItems(page);
              items = [...items, ...newItems];
              page++;
              loading = false;
            }
          
            $effect(() => {
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting && !loading) {
                    loadMore();
                  }
                },
                { threshold: 1 }
              );
          
              observer.observe(document.querySelector('#sentinel'));
          
              return () => observer.disconnect();
            });
          </script>
          
          {#each items as item}
            <div>{item}</div>
          {/each}
          
          <div id="sentinel" />
          {#if loading}
            <div>Loading...</div>
          {/if}
          \`\`\`
          
          ## 4. Dark Mode Toggle
          
          This snippet implements a dark mode toggle that persists the user's preference.
          
          \`\`\`svelte
          <script>
            let darkMode = $state(localStorage.getItem('darkMode') === 'true');
          
            $effect(() => {
              localStorage.setItem('darkMode', darkMode);
              if (darkMode) {
                document.body.classList.add('dark');
              } else {
                document.body.classList.remove('dark');
              }
            });
          </script>
          
          <button on:click={() => darkMode = !darkMode}>
            Toggle {darkMode ? 'Light' : 'Dark'} Mode
          </button>
          \`\`\`
          
          ## 5. Form Validation
          
          This snippet provides a simple form validation utility using runes.
          
          \`\`\`svelte
          <script>
            let name = $state('');
            let email = $state('');
            let errors = $derived({
              name: name.length < 3 ? 'Name must be at least 3 characters' : null,
              email: !email.includes('@') ? 'Invalid email address' : null
            });
            let isValid = $derived(!Object.values(errors).some(Boolean));
          
            function handleSubmit() {
              if (isValid) {
                // Submit form
              }
            }
          </script>
          
          <form on:submit|preventDefault={handleSubmit}>
            <input bind:value={name} placeholder="Name" />
            {#if errors.name}<span class="error">{errors.name}</span>{/if}
          
            <input bind:value={email} placeholder="Email" />
            {#if errors.email}<span class="error">{errors.email}</span>{/if}
          
            <button disabled={!isValid}>Submit</button>
          </form>
          \`\`\`
          
          These snippets showcase some of the powerful features of Svelte 5 and how runes can be used to create efficient, reactive code. Experiment with them in your projects to see how they can enhance your development workflow!`,
			rendered_body: `<h1>5 Useful Svelte Snippets</h1>
  
  <p>Here are 5 Svelte snippets that will boost your productivity and help you write cleaner, more efficient code. These snippets are compatible with Svelte 5 and take advantage of the new runes system where applicable.</p>
  
  <h2>1. Reactive Local Storage</h2>
  
  <p>This snippet creates a reactive wrapper around localStorage, allowing you to easily sync state with browser storage.</p>
  
  <pre><code class="language-javascript">function persistentState(key, initialValue) {
    let value = $state(JSON.parse(localStorage.getItem(key)) ?? initialValue);
    
    $effect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    });
  
    return value;
  }
  
  // Usage
  let count = persistentState('count', 0);
  </code></pre>
  
  <h2>2. Debounced Input</h2>
  
  <p>This snippet creates a debounced input component, useful for search inputs or any scenario where you want to limit the frequency of updates.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    export let value = '';
    export let delay = 300;
  
    let inputValue = $state(value);
    let timeoutId;
  
    $effect(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        value = inputValue;
      }, delay);
    });
  &lt;/script&gt;
  
  &lt;input bind:value={inputValue} /&gt;
  </code></pre>
  
  <h2>3. Infinite Scroll</h2>
  
  <p>This snippet implements a basic infinite scroll functionality, loading more items as the user scrolls to the bottom of the page.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    let items = $state([]);
    let loading = $state(false);
    let page = $state(1);
  
    async function loadMore() {
      loading = true;
      const newItems = await fetchItems(page);
      items = [...items, ...newItems];
      page++;
      loading = false;
    }
  
    $effect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !loading) {
            loadMore();
          }
        },
        { threshold: 1 }
      );
  
      observer.observe(document.querySelector('#sentinel'));
  
      return () => observer.disconnect();
    });
  &lt;/script&gt;
  
  {#each items as item}
    &lt;div&gt;{item}&lt;/div&gt;
  {/each}
  
  &lt;div id="sentinel" /&gt;
  {#if loading}
    &lt;div&gt;Loading...&lt;/div&gt;
  {/if}
  </code></pre>
  
  <h2>4. Dark Mode Toggle</h2>
  
  <p>This snippet implements a dark mode toggle that persists the user's preference.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    let darkMode = $state(localStorage.getItem('darkMode') === 'true');
  
    $effect(() => {
      localStorage.setItem('darkMode', darkMode);
      if (darkMode) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
      }
    });
  &lt;/script&gt;
  
  &lt;button on:click={() => darkMode = !darkMode}&gt;
    Toggle {darkMode ? 'Light' : 'Dark'} Mode
  &lt;/button&gt;
  </code></pre>
  
  <h2>5. Form Validation</h2>
  
  <p>This snippet provides a simple form validation utility using runes.</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    let name = $state('');
    let email = $state('');
    let errors = $derived({
      name: name.length < 3 ? 'Name must be at least 3 characters' : null,
      email: !email.includes('@') ? 'Invalid email address' : null
    });
    let isValid = $derived(!Object.values(errors).some(Boolean));
  
    function handleSubmit() {
      if (isValid) {
        // Submit form
      }
    }
  &lt;/script&gt;
  
  &lt;form on:submit|preventDefault={handleSubmit}&gt;
    &lt;input bind:value={name} placeholder="Name" /&gt;
    {#if errors.name}&lt;span class="error"&gt;{errors.name}&lt;/span&gt;{/if}
  
    &lt;input bind:value={email} placeholder="Email" /&gt;
    {#if errors.email}&lt;span class="error"&gt;{errors.email}&lt;/span&gt;{/if}
  
    &lt;button disabled={!isValid}&gt;Submit&lt;/button&gt;
  &lt;/form&gt;
  </code></pre>
  
  <p>These snippets showcase some of the powerful features of Svelte 5 and how runes can be used to create efficient, reactive code. Experiment with them in your projects to see how they can enhance your development workflow!</p>`,
			slug: '5-useful-svelte-snippets',
			description: 'Boost your Svelte development with these snippets',
			tags: [tagMap.get('svelte-5'), tagMap.get('snippet'), tagMap.get('utility')]
		},
		{
			title: 'Building a Todo App with Svelte 5',
			type: 'recipe',
			body: `# Building a Todo App with Svelte 5
          
          In this tutorial, we'll build a todo app using Svelte 5 and runes. This project will demonstrate how to use the new reactivity system to create a dynamic and efficient user interface.
          
          ## Setting Up the Project
          
          First, let's set up a new Svelte project using the Svelte CLI:
          
          \`\`\`bash
          npm create svelte@latest my-todo-app
          cd my-todo-app
          npm install
          \`\`\`
          
          ## Creating the Todo Store
          
          We'll start by creating a store to manage our todos. Create a new file \`src/stores/todos.js\`:
          
          \`\`\`javascript
          import { writable } from 'svelte/store';
          
          function createTodos() {
            const { subscribe, update } = writable([]);
          
            return {
              subscribe,
              add: (text) => update(todos => [...todos, { id: Date.now(), text, completed: false }]),
              toggle: (id) => update(todos => todos.map(todo => 
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
              )),
              remove: (id) => update(todos => todos.filter(todo => todo.id !== id)),
            };
          }
          
          export const todos = createTodos();
          \`\`\`
          
          ## Creating the Todo List Component
          
          Now, let's create a TodoList component. Create a new file \`src/components/TodoList.svelte\`:
          
          \`\`\`svelte
          <script>
            import { todos } from '../stores/todos.js';
            
            let newTodo = $state('');
          
            function addTodo() {
              if (newTodo.trim()) {
                todos.add(newTodo);
                newTodo = '';
              }
            }
          </script>
          
          <div>
            <input bind:value={newTodo} placeholder="What needs to be done?" />
            <button on:click={addTodo}>Add Todo</button>
          </div>
          
          <ul>
            {#each $todos as todo (todo.id)}
              <li>
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  on:change={() => todos.toggle(todo.id)} 
                />
                <span class:completed={todo.completed}>{todo.text}</span>
                <button on:click={() => todos.remove(todo.id)}>Delete</button>
              </li>
            {/each}
          </ul>
          
          <style>
            .completed {
              text-decoration: line-through;
              color: #888;
            }
          </style>
          \`\`\`
          
          ## Updating the App Component
          
          Finally, let's update the main App component to use our TodoList. Update \`src/App.svelte\`:
          
          \`\`\`svelte
          <script>
            import TodoList from './components/TodoList.svelte';
          </script>
          
          <main>
            <h1>Svelte 5 Todo App</h1>
            <TodoList />
          </main>
          
          <style>
            main {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
          </style>
          \`\`\`
          
          ## Running the App
          
          Now you can run your Svelte 5 Todo app:
          
          \`\`\`bash
          npm run dev
          \`\`\`
          
          Visit \`http://localhost:5000\` in your browser to see the app in action!
          
          ## Conclusion
          
          This tutorial demonstrated how to build a simple Todo app using Svelte 5 and runes. We've seen how to:
          
          1. Set up a Svelte 5 project
          2. Create a store for managing application state
          3. Use runes for local component state
          4. Create reusable components
          5. Bind events and handle user interactions
          
          Experiment with this app and try adding more features, such as filtering todos or saving them to localStorage. Happy coding!`,
			rendered_body: `<h1>Building a Todo App with Svelte 5</h1>
  
  <p>In this tutorial, we'll build a todo app using Svelte 5 and runes. This project will demonstrate how to use the new reactivity system to create a dynamic and efficient user interface.</p>
  
  <h2>Setting Up the Project</h2>
  
  <p>First, let's set up a new Svelte project using the Svelte CLI:</p>
  
  <pre><code class="language-bash">npm create svelte@latest my-todo-app
  cd my-todo-app
  npm install
  </code></pre>
  
  <h2>Creating the Todo Store</h2>
  
  <p>We'll start by creating a store to manage our todos. Create a new file <code>src/stores/todos.js</code>:</p>
  
  <pre><code class="language-javascript">import { writable } from 'svelte/store';
  
  function createTodos() {
    const { subscribe, update } = writable([]);
  
    return {
      subscribe,
      add: (text) => update(todos => [...todos, { id: Date.now(), text, completed: false }]),
      toggle: (id) => update(todos => todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )),
      remove: (id) => update(todos => todos.filter(todo => todo.id !== id)),
    };
  }
  
  export const todos = createTodos();
  </code></pre>
  
  <h2>Creating the Todo List Component</h2>
  
  <p>Now, let's create a TodoList component. Create a new file <code>src/components/TodoList.svelte</code>:</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    import { todos } from '../stores/todos.js';
    
    let newTodo = $state('');
  
    function addTodo() {
      if (newTodo.trim()) {
        todos.add(newTodo);
        newTodo = '';
      }
    }
  &lt;/script&gt;
  
  &lt;div&gt;
    &lt;input bind:value={newTodo} placeholder="What needs to be done?" /&gt;
    &lt;button on:click={addTodo}&gt;Add Todo&lt;/button&gt;
  &lt;/div&gt;
  
  &lt;ul&gt;
    {#each $todos as todo (todo.id)}
      &lt;li&gt;
        &lt;input 
          type="checkbox" 
          checked={todo.completed} 
          on:change={() => todos.toggle(todo.id)} 
        /&gt;
        &lt;span class:completed={todo.completed}&gt;{todo.text}&lt;/span&gt;
        &lt;button on:click={() => todos.remove(todo.id)}&gt;Delete&lt;/button&gt;
      &lt;/li&gt;
    {/each}
  &lt;/ul&gt;
  
  &lt;style&gt;
    .completed {
      text-decoration: line-through;
      color: #888;
    }
  &lt;/style&gt;
  </code></pre>
  
  <h2>Updating the App Component</h2>
  
  <p>Finally, let's update the main App component to use our TodoList. Update <code>src/App.svelte</code>:</p>
  
  <pre><code class="language-svelte">&lt;script&gt;
    import TodoList from './components/TodoList.svelte';
  &lt;/script&gt;
  
  &lt;main&gt;
    &lt;h1&gt;Svelte 5 Todo App&lt;/h1&gt;
    &lt;TodoList /&gt;
  &lt;/main&gt;
  
  &lt;style&gt;
    main {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
  &lt;/style&gt;
  </code></pre>
  
  <h2>Running the App</h2>
  
  <p>Now you can run your Svelte 5 Todo app:</p>
  
  <pre><code class="language-bash">npm run dev
  </code></pre>
  
  <p>Visit <code>http://localhost:5000</code> in your browser to see the app in action!</p>
  
  <h2>Conclusion</h2>
  
  <p>This tutorial demonstrated how to build a simple Todo app using Svelte 5 and runes. We've seen how to:</p>
  
  <ol>
  <li>Set up a Svelte 5 project</li>
  <li>Create a store for managing application state</li>
  <li>Use runes for local component state</li>
  <li>Create reusable components</li>
  <li>Bind events and handle user interactions</li>
  </ol>
  
  <p>Experiment with this app and try adding more features, such as filtering todos or saving them to localStorage. Happy coding!</p>`,
			slug: 'todo-app-svelte-5',
			description: 'Step-by-step guide to building a todo app with Svelte 5',
			tags: [tagMap.get('svelte-5'), tagMap.get('runes'), tagMap.get('utility')]
		},
		{
			title: 'Svelte 5 Tutorial Series',
			type: 'collection',
			body: 'A comprehensive series of tutorials covering Svelte 5 features and best practices.',
			rendered_body:
				'<p>A comprehensive series of tutorials covering Svelte 5 features and best practices.</p>',
			slug: 'svelte-5-tutorial-series',
			description: 'Learn Svelte 5 from the ground up',
			tags: [tagMap.get('svelte-5'), tagMap.get('tutorial')],
			children: []
		}
	];

	const insertContentAndTags = db.transaction((item) => {
		const children = JSON.stringify(item.children || []);
		const now = new Date().toISOString();

		const info = insertContentStmt.get(
			item.title,
			item.type,
			item.body,
			item.rendered_body,
			item.slug,
			item.description,
			children,
			'published',
			now,
			now
		) as { id: string };

		const contentId = info.id;

		for (const tagId of item.tags) {
			insertContentTagStmt.run(contentId, tagId);
		}

		return contentId;
	});

	try {
		for (const item of contentItems) {
			insertContentAndTags(item);
		}
		insetContentUserStmt.run();
		console.log('Content seeded successfully');
	} catch (error) {
		console.error('Error seeding content:', error);
	}
}
