<script>
	import logo from './logo.svg';
</script>

<div class="font-body grid h-screen grid-cols-[2fr_3fr] gap-2">
	<div class="flex h-screen flex-col place-content-center gap-20">
		<img class="mx-auto max-w-64" src={logo} alt="Svelte Society logo" />
		<div class="mx-auto flex flex-col place-content-center gap-4 text-center">
			<span class="font-thin tracking-widest">SPONSORED BY</span>
			<div class="min-w-56 max-w-64 rounded-lg bg-black px-8 py-10 text-center">
				<span class="font-semibold tracking-widest text-white">YOU?</span>
			</div>
		</div>
	</div>
	<div class="bg-tertiary">Here be text</div>
</div>
