<template>
    <div class="bg-[#edf1f5] flex w-screen h-screen justify-center items-center">
        <div class="bg-aniWhite rounded-aniRounded p-[50px] flex flex-col">
            <h1 class="text-2xl text-center text-aniGray mb-[30px] font-semibold">AniTierList</h1>
            <el-input v-model="username" class="mb-[15px] aniBody aniInput" placeholder="Username" @keyup.enter="enterClicked()">
                <template #prefix>
                    <el-icon>
                        <search />
                    </el-icon>
                </template>
            </el-input>
            <el-switch inactive-text="Rank anime" active-text="Rank season" v-model="sequelRank" />
            <el-checkbox v-model="autoSetEntries" label="Auto rank anime" />
            <!-- <AniMultiRangeSlider class="mb-[15px] w-11/12 self-center" v-model="range"/> -->
            <el-button type="primary" size="large" @click="enterClicked()" class="mt-[15px]" :disabled="username =='' ">Search</el-button>
        </div>
    </div>
</template>
<script>
import { ElButton, ElInput, ElSwitch, ElCheckbox, ElSlider, ElIcon } from "element-plus";
import { Search } from '@element-plus/icons-vue'
import { ref } from 'vue'

export default {
    name: "Homepage",
    components: {
        ElButton,
        ElInput,
        ElSwitch,
        ElCheckbox,
        ElIcon,
        ElSlider,
        Search
    },
    data() {
        return {
            username: '',
            autoSetEntries: false,
            sequelRank: false,
            range: [0,10]
        }
    },
    methods: {
        enterClicked() {
            const router = useRouter()
            let queries = {}
            if (this.autoSetEntries) queries["auto"] = true;
            if (this.sequelRank) queries["seasons"] = true;
            if (this.range[0] != 0) queries["min"] = this.range[0];
            if (this.range[1] != 10) queries["max"] = this.range[1];

            console.log(queries);
            if (this.username != "") {
                router.push({ path: this.username, query: queries });
            }
        }
    }
}
</script>

<style>
.el-button {
    --el-color-primary: #3db4f2;
    --el-color-white: #edf1f5;
    --el-button-text-color: var(--el-color-white);
    --el-button-border-color: var(--el-color-primary);
    --el-button-outline-color: var(--el-color-primary);
    --el-button-active-color: var(--el-color-primary);
    --el-button-hover-text-color: var(--el-color-white);
    --el-button-hover-link-text-color: var(--el-color-primary);
    --el-button-hover-bg-color: var(--el-color-primary);
    --el-button-hover-border-color: var(--el-color-primary);
    --el-button-active-bg-color: var(--el-color-primary);
    --el-button-active-border-color: var(--el-color-primary);
    --el-button-disabled-text-color: var(--el-color-white);
    --el-button-disabled-bg-color: var(--el-color-primary-light-5);
    --el-button-disabled-border-color: var(--el-color-primary-light-5);
    font-size: var(--el-font-size-medium);
    transition: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    display: flex;
    height: fit-content;
}

.el-button:hover:not(:disabled) {
    box-shadow: 0 1px 10px 0 rgba(49, 54, 68, 0.15);
}

.aniBody>.el-input__wrapper {
    background-color: #f2f4f7 !important;
    box-shadow: none !important;
}

.aniInput>.el-input__wrapper {
    position: relative;
    width: 100%;
    border-radius: 4px;
}

.el-input__wrapper.is-focus:has(input) {
    box-shadow: none;
}

.el-input__wrapper:hover:has(input) {
    box-shadow: none;
}

.aniInput>.el-input__wrapper>.el-input__inner {
    color: #5c728a;
    line-height: 40px;
    height: 40px;
    font-size: 14px;
    font-weight: 400;
    font-family: sans-serif;
}

.el-input__inner::placeholder {
    color: #c0c4cc;
}

/* placeholder:text-aniGray/80 px-[15px] w-full bg-aniBody rounded-aniRounded leading-aniLeading text-[14px] focus:outline-0 mb-[15px] placeholder:font-medium placeholder:font-[sans-serif] font-semibold py-0 */
</style>