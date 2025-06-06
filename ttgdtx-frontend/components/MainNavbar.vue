<template>
  <nav class="w-full bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <!-- Logo Section -->
        <div class="flex items-center">
          <NuxtLink
            to="/"
            class="flex items-center space-x-2"
          >
            <div class="text-2xl font-bold text-red-600">CNN</div>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <NuxtLink
            v-for="item in navigationItems"
            :key="item.name"
            :to="item.href"
            :class="[
              'px-3 py-2 text-sm font-medium transition-colors duration-200',
              item.active
                ? 'text-red-600 font-semibold'
                : 'text-gray-700 hover:text-gray-900',
            ]"
          >
            {{ item.name }}
          </NuxtLink>
        </div>

        <!-- Right Section - Search, User Menu -->
        <div class="flex items-center space-x-4">
          <!-- Search Button -->
          <Button
            variant="ghost"
            size="sm"
            class="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            @click="toggleSearch"
          >
            <Search class="h-4 w-4" />
            <span class="text-sm">Search</span>
          </Button>

          <!-- User Menu -->
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="flex items-center space-x-2"
              >
                <User class="h-4 w-4" />
                <span class="hidden sm:inline text-sm">Account</span>
                <ChevronDown class="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              class="w-48"
            >
              <DropdownMenuItem
                v-if="!isAuthenticated()"
                @click="navigateTo('/login')"
              >
                <LogIn class="mr-2 h-4 w-4" />
                Sign In
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="!isAuthenticated()"
                @click="navigateTo('/register')"
              >
                <UserPlus class="mr-2 h-4 w-4" />
                Sign Up
              </DropdownMenuItem>
              <template v-if="isAuthenticated()">
                <DropdownMenuItem @click="navigateTo('/profile')">
                  <User class="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem @click="navigateTo('/settings')">
                  <Settings class="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem @click="handleLogout">
                  <LogOut class="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </template>
            </DropdownMenuContent>
          </DropdownMenu>

          <!-- Mobile Menu Button -->
          <Button
            variant="ghost"
            size="sm"
            class="md:hidden"
            @click="toggleMobileMenu"
          >
            <Menu
              v-if="!isMobileMenuOpen"
              class="h-5 w-5"
            />
            <X
              v-else
              class="h-5 w-5"
            />
          </Button>
        </div>
      </div>

      <!-- Search Bar (Expandable) -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isSearchOpen"
          class="pb-4"
        >
          <div class="relative max-w-md mx-auto">
            <Input
              v-model="searchQuery"
              type="text"
              placeholder="Search news..."
              class="pl-10 pr-4"
              @keyup.enter="handleSearch"
            />
            <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </Transition>

      <!-- Mobile Navigation Menu -->
      <Transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isMobileMenuOpen"
          class="md:hidden pb-4"
        >
          <div class="flex flex-col space-y-2">
            <NuxtLink
              v-for="item in navigationItems"
              :key="item.name"
              :to="item.href"
              :class="[
                'px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                item.active
                  ? 'text-red-600 font-semibold bg-red-50'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
              ]"
              @click="closeMobileMenu"
            >
              {{ item.name }}
            </NuxtLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { navigateTo, useRoute, useCookie, useRouter } from 'nuxt/app'
import {
  Search,
  User,
  ChevronDown,
  Menu,
  X,
  LogIn,
  LogOut,
  UserPlus,
  Settings,
} from 'lucide-vue-next'

const router = useRouter()

// Navigation items
const navigationItems = ref([
  { name: 'Home', href: '/', active: false },
  { name: 'World', href: '/world', active: false },
  { name: 'Politics', href: '/politics', active: false },
  { name: 'Business', href: '/business', active: false },
  { name: 'Technology', href: '/technology', active: false },
  { name: 'Sports', href: '/sports', active: false },
])

// State management
const isMobileMenuOpen = ref(false)
const isSearchOpen = ref(false)
const searchQuery = ref('')

// Authentication state - check if user has access token
const isAuthenticated = () => !!useCookie('accessToken').value

// Methods
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  if (isMobileMenuOpen.value) {
    isSearchOpen.value = false
  }
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value
  if (isSearchOpen.value) {
    isMobileMenuOpen.value = false
  }
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Handle search logic here
    navigateTo(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    isSearchOpen.value = false
    searchQuery.value = ''
  }
}

const handleLogout = async () => {
  try {
    // Clear cookies - same as your index page logout function
    useCookie('accessToken', { secure: true }).value = null
    useCookie('refreshToken', { secure: true }).value = null
    useCookie('userId', { secure: true }).value = null

    // Redirect to login page
    await router.push('/login')
  }
  catch (error) {
    console.error('Logout error:', error)
  }
}

// Set active navigation item based on current route
const route = useRoute()
watch(() => route.path, (newPath) => {
  navigationItems.value.forEach((item) => {
    item.active = item.href === newPath || (item.href !== '/' && newPath.startsWith(item.href))
  })
}, { immediate: true })
</script>

<style scoped>
/* Custom styles if needed */
</style>
