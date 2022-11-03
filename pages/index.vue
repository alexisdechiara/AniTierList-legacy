<template>
    <div class="bg-[#edf1f5] flex w-screen h-full justify-center items-center">
        <div class="bg-aniWhite rounded-aniRounded p-[50px] flex flex-col">
            <h1 class="text-2xl text-center text-[#5f7189] mb-[30px] mt-[20px] font-[Roboto] font-semibold">AniTierList</h1>
            <el-input v-model="username" class="mb-[15px] ani-input-username" placeholder="Username" @keyup.enter="enterClicked()">
                <template #prefix>
                    <el-icon>
                        <search />
                    </el-icon>
                </template>
            </el-input>
            <el-switch inactive-text="Rank anime" active-text="Rank season" v-model="sequelRank" />
            <el-checkbox v-model="autoSetEntries" label="Auto rank anime" />
            <!-- <AniMultiRangeSlider class="mb-[15px] w-11/12 self-center" v-model="range"/> -->
            <el-button type="primary" size="large" @click="enterClicked()" class="ani-button-search" :disabled="username =='' ">Search</el-button>
        </div>
    </div>
</template>
<script>
import { ElButton, ElInput, ElSwitch, ElCheckbox, ElSlider, ElIcon } from "element-plus";
import { Search } from '@element-plus/icons-vue'

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