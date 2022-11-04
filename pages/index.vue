<template>
    <div class="bg-[#edf1f5] flex flex-col w-full min-h-screen h-full justify-start items-center ">
        <div class="bg-aniWhite rounded-aniRounded p-[50px] mt-[60px] flex flex-col w-full max-w-[400px]">
            <h1 class="text-2xl text-center text-[#5f7189] mb-[30px] mt-[20px] font-[Roboto] font-semibold">AniTierList (UNOFFICIAL)</h1>
            <el-input v-model="username" class="mb-[15px] ani-input-username" placeholder="Username" @keyup.enter="enterClicked()">
                <template #prefix>
                    <font-awesome-icon icon="fa-solid fa-search" />
                </template>
            </el-input>
            <el-switch class="w-full flex justify-center" inactive-text="Rank anime" active-text="Rank season" v-model="sequelRank" />
            <el-checkbox v-model="autoSetEntries" label="Auto rank anime" />
            <!-- <AniMultiRangeSlider class="mb-[15px] w-11/12 self-center" v-model="range"/> -->
            <el-button type="primary" size="large" @click="enterClicked()" class="ani-button-search" :disabled="username =='' ">Search</el-button>
        </div>
    </div>
</template>
<script>
import { ElButton, ElInput, ElSwitch, ElCheckbox, ElSlider } from "element-plus";
import { mapStores } from "pinia";

export default {
    name: "Homepage",
    components: {
        ElButton,
        ElInput,
        ElSwitch,
        ElCheckbox,
        ElSlider,
    },
    data() {
        return {
            username: '',
            autoSetEntries: false,
            sequelRank: false,
            range: [0,10]
        }
    },
    computed: {
        ...mapStores(useStore)
    },
    methods: {
        enterClicked() {
            const router = useRouter();

            this.modelStore.options.auto = this.autoSetEntries;
            if (this.sequelRank) {
                this.modelStore.options.type = "";
            } else {
                this.modelStore.options.type = "PREQUEL";
            }
            if (this.range[0] != 0) this.modelStore.options.minScore = this.range[0];
            if (this.range[1] != 10) this.modelStore.options.maxScore = this.range[1];

            if (this.username != "") {
                router.push(this.username);
            }
        }
    }
}
</script>