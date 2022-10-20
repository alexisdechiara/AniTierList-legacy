<template>
    <div class="bg-[#edf1f5] flex w-screen h-screen justify-center items-center">
        <div class="bg-aniWhite rounded-aniRounded p-[50px] flex flex-col">
            <h1 class="text-2xl text-center text-aniGray mb-[30px] font-semibold">AniTierList</h1>
            <input class="placeholder:text-aniGray/80 px-[15px] w-full bg-aniBody rounded-aniRounded leading-aniLeading text-[14px] focus:outline-0 mb-[15px] placeholder:font-medium placeholder:font-[sans-serif] font-semibold py-0" @keyup.enter="enterClicked" type="text" placeholder="Username" name="usernameInput" v-model="username">
            <NuxtLink :to="username" class="inline-block py-[10px] px-[30px] Button box-border bg-aniPrimary rounded-aniRounded text-[16px] text-aniWhite mt-[10px] font-semibold cursor-pointer text-center transition ease-in hover:shadow-aniShadowButton">Let's go</NuxtLink>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            username: "",
        }
    },
    methods: {
        enterClicked() {
            const router = useRouter()
            router.push(this.username);
        }
    }
}
</script>