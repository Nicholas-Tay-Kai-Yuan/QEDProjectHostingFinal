if (__DEV__) {
    import("./ReactotronConfig").then(() =>
        console.log("Reactotron Configured")
    );
}


import React from "react";
import { NativeRouter, Route, Routes } from "react-router-native";
// Error pages import
import Error403 from "./components/pages/error-pages/403";
import Error404 from "./components/pages/error-pages/404";
// Group Question pages import
import GroupCreateQuestion from "./components/pages/group-pages/question-pages/GroupCreateQuestion";
import GroupShowQuestion from "./components/pages/group-pages/question-pages/GroupShowQuestion";

// Quiz Pages Import
import QuizInstruction from "./components/quiz-components/pages/QuizInstruction";
import DoQuiz from "./components/quiz-components/pages/DoQuiz";
import Result from "./components/quiz-components/pages/Result";

// Group pages import
import GroupAnnouncement from "./components/pages/group-pages/GroupAnnouncement";
import GroupAskAQuestion from "./components/pages/group-pages/GroupAskAQuestion";
import GroupAssignment from "./components/pages/group-pages/GroupAssignment";
import GroupLeaderboard from "./components/pages/group-pages/GroupLeaderboard";
import GroupMember from "./components/pages/group-pages/GroupMember";
import GroupProgress from "./components/pages/group-pages/GroupProgress";
import GroupListing from "./components/pages/group-pages/GroupListing";

// Learning Resources pages import
import LearningResourcesPrimary from "./components/pages/learning-resources-pages/LearningResourcesPrimary";
import LearningResourcesSecondary from "./components/pages/learning-resources-pages/LearningResourcesSecondary";
import LearningResourcesLevel from "./components/pages/learning-resources-pages/LearningResourcesLevel";
import LearningResourcesPublic from "./components/pages/learning-resources-pages/LearningResourcesPublic";
import LearningResourcesLevelPublic from "./components/pages/learning-resources-pages/LearningResourcesLevelPublic";
// Individual pages import
import AccountSettings from "./components/pages/individual-pages/AccountSettings";
import Assignment from "./components/pages/individual-pages/Assignment";
import Control from "./components/pages/individual-pages/Control";
import Game from "./components/pages/individual-pages/Game";
import Home from "./components/pages/individual-pages/Home";
import Leaderboard from "./components/pages/individual-pages/Leaderboard";
import Login from "./components/pages/individual-pages/Login";
import ResetPassword from "./components/pages/individual-pages/ResetPassword"
import RequestPasswordReset from "./components/pages/individual-pages/RequestPasswordReset";
import Overview from "./components/pages/individual-pages/Overview";
import Quiz from "./components/pages/individual-pages/Quiz";
import SignUp from "./components/pages/individual-pages/SignUp";
import Stats from "./components/pages/individual-pages/Stats";
import ViewPastQuiz from "./components/pages/individual-pages/ViewPastQuiz";


// Fonts Import
import { useFonts } from "expo-font";
import AppLoading from "expo-app-loading";

import "react-native-gesture-handler";

import { StatusBar } from "react-native";
import resetPasswordRequest from "./axios/user-api/resetPasswordRequest";

export default App = () => {
    const [isLoaded] = useFonts({
        Coolvetica: require("./assets/fonts/coolvetica/coolvetica_rg.ttf"),
        Poppins: require("./assets/fonts/poppins/Poppins-Regular.ttf"),
        Feather: require("./assets/fonts/feather/feather.ttf")
    });
    if (!isLoaded) {
        return <AppLoading />;
    }
    return (
        <NativeRouter>
            <StatusBar hidden={true}/>
            <Routes>
                {/* Error routes */}
                <Route exact path="/403" element={<Error403 />} />
                <Route exact path="/404" element={<Error404 />} />

                <Route
                    exact
                    path="/"
                    element={<Home />}
                />
                {/* Group Question Routes */}
                <Route
                    exact
                    path="/group_create_question"
                    element={<GroupCreateQuestion />}
                />
                <Route
                    exact
                    path="/group_show_question"
                    element={<GroupShowQuestion />}
                />
                {/* Quiz Routes */}
                <Route
                    exact
                    path="/QuizInstruction"
                    element={<QuizInstruction/>}
                />

                <Route
                    exact
                    path="/DoQuiz"
                    element={<DoQuiz/>}
                />
                
                <Route
                    exact
                    path="/Result"
                    element={<Result/>}
                />
                
                {/* Group Routes */}
                <Route exact path="/groupqna" element={<GroupAskAQuestion />} />
                <Route
                    exact
                    path="/group_announcement"
                    element={<GroupAnnouncement />}
                />
                <Route
                    exact
                    path="/group_assignment"
                    element={<GroupAssignment />}
                />
                <Route exact path="/group_members" element={<GroupMember />} />
                <Route
                    exact
                    path="/group_leaderboard"
                    element={<GroupLeaderboard />}
                />
                <Route
                    exact
                    path="/group_listing"
                    element={<GroupListing />}
                />
                <Route
                    exact
                    path="/group_progress"
                    element={<GroupProgress />}
                />

                {/* Learning Resources Routes */}
                <Route
                    exact
                    path="/learningresourceslevel"
                    element={<LearningResourcesLevel />}
                />
                <Route
                    exact
                    path="/learningresourcesprimary"
                    element={<LearningResourcesPrimary />}
                />
                <Route
                    exact
                    path="/learningresourcessecondary"
                    element={<LearningResourcesSecondary />}
                />
                <Route
                    exact
                    path="/learningresourcespublic"
                    element={<LearningResourcesPublic />}
                />
                <Route
                    exact
                    path="/learningresourceslevelpublic"
                    element={<LearningResourcesLevelPublic />}
                />

                {/* Individual Pages Routes */}
                <Route exact path="/profile" element={<AccountSettings />} />
                <Route exact path="/assignment" element={<Assignment />} />
                <Route exact path="/control" element={<Control />} />
                <Route exact path="/game" element={<Game />} />
                <Route exact path="/" element={<Home />} />
                <Route exact path="/leaderboard" element={<Leaderboard />} />
                <Route exact path="/login" element={<Login />} />
                <Route exact path="/resetPassword" element={<ResetPassword />} />
                <Route exact path="/requestPasswordReset" element={<RequestPasswordReset />} />
                <Route exact path="/overview" element={<Overview />} />
                <Route exact path="/quiz" element={<Quiz />} />
                <Route exact path="/signup" element={<SignUp />} />
                <Route exact path="/stats" element={<Stats />} />
                <Route exact path="/viewpastquiz" element={<ViewPastQuiz />} />
                <Route exact path="/learningresourcespublic" element={<LearningResourcesPublic />} />
                <Route exact path="/learningresourceslevelpublic" element={<LearningResourcesLevelPublic />} />

                <Route exact path="/*" element={<Error404 />} />
            </Routes>
        </NativeRouter>
    );
};
