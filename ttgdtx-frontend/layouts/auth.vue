<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md">
      <!-- CNN Logo -->
      <div class="text-center mb-8">
        <div class="inline-block bg-red-600 text-white font-bold text-2xl px-4 py-2 rounded">
          CNN
        </div>
      </div>

      <!-- Main Card -->
      <Card class="shadow-lg border-0">
        <CardContent class="p-8">
          <slot />
        </CardContent>
      </Card>
    </div>
  </div>
</template>
