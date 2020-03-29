<template>
  <div class="max-w-md mx-auto pt-6">
    <div>
      <h1 class="text-xl mb-3">Login</h1>

      <!-- Unauthenticated -->
      <div v-if="!$auth.isAuthenticated">
        <form @submit.prevent="login">
          <input v-model="form.email" type="text" placeholder="Username" class="form-control" />
          <input
            v-model="form.password"
            type="password"
            placeholder="Password"
            class="form-control"
          />
          <button type="submit" class="button--green">Login</button>
        </form>

        <nuxt-link to="/register">Need an account? Register</nuxt-link>
      </div>

      <!-- Authenticated -->
      <div v-else>
        You're logged in as {{ $auth.email }}.
        <button
          @click="$store.dispatch('auth/logout')"
          class="button--green"
        >Logout</button>
      </div>
    </div>
  </div>
</template>


<script>
export default {
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  methods: {
    async login() {
      try {
        await this.$store.dispatch('auth/login', this.form)
        this.$router.push('/')
      } catch (error) {
        console.log({ error })
      }
    }
  }
}
</script>