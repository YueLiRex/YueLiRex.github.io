---
title: "All kinds of Performance Testing"
description: "Describe all kinds of performance test"
summary: "This article describes all kinds of performance test。 You understand different types of stress tests and what each of them focuses on."
date: 2025-10-12T16:27:22+02:00
lastmod: 2025-12-20T16:27:22+02:00
draft: false
weight: 50
categories: []
tags: [Smoke tests, Average load test, Stress tests, Soak tests, Spike tests, Breakpoint tests ]
contributors: []
pinned: false
homepage: false
seo:
  title: "All kinds of Performance Testing" # custom title (optional)
  description: "Describe all kinds of performance test" # custom description (recommended)
  canonical: "" # custom canonical URL (optional)
  noindex: false # false (default) or true
---

## **Different tests for different goals**

Start with smoke tests, then progress to higher loads and longer durations.

The main types are as follows. Each type has its own article outlining its essential concepts.

- **Smoke tests** validate that your script works and that the system performs adequately under minimal load.
- **Average load test** checks how your system performs under expected normal conditions.
- **Stress tests** evaluate a system's performance at its limits when the load exceeds the expected average.
- **Soak tests** assess the reliability and performance of your system over extended periods.
- **Spike tests** validate the behavior and survival of your system in cases of sudden, short, and massive increases in activity.
- **Breakpoint tests** gradually increase the load to identify the capacity limits of the system.

![](https://grafana.com/media/docs/k6-oss/chart-load-test-types-overview.png)

# **Smoke testing**

Smoke tests have a minimal load. Run them to verify that the system works well under minimal load and to gather baseline performance values.

This test type consists of running tests with a few VUs — more than 5 VUs could be considered a mini-load test.

Similarly, the test should execute for a short period, either a low number of [iterations](https://grafana.com/docs/k6/latest/using-k6/k6-options/reference#iterations) or a [duration](https://grafana.com/docs/k6/latest/using-k6/k6-options/reference#duration) from seconds to a few minutes maximum.

![](https://grafana.com/media/docs/k6-oss/chart-smoke-test-overview.png)

In some testing conversation, smoke tests are also called shakeout tests.

## **When to run a Smoke test**

Teams should run smoke tests whenever a test script is created or updated. Smoke testing should also be done whenever the relevant application code is updated.

It’s a good practice to run a smoke test as a first step, with the following goals:

- Verify that your test script doesn’t have errors.
- Verify that your system doesn’t throw any errors (performance or system related) when under minimal load.
- Gather baseline performance metrics of your system’s response under minimal load.
- With simple logic, to serve as a synthetic test to monitor the performance and availability of production environments.

## **Considerations**

When you prepare a smoke test, consider the following:

- **Each time you create or update a script, run a smoke test**

    Because smoke tests verify test scripts, try to run one every time you create or update a script. Avoid running other test types with untested scripts.

- **Keep throughput small and duration short**

    Configure your test script to be executed by a small number of VUs (from 2 to 20) with few iterations or brief durations (30 seconds to 3 minutes).


## **Results analysis**

The smoke test initially validates that your script runs without errors. If any script-related errors appear, correct the script before trying any more extensive tests.

On the other hand, if you notice poor performance with these low VU numbers, report it, fix your environment, and try again with a smoke test before any further tests.

Once your smoke test shows zero errors and the performance results seem acceptable, you can proceed to other test types.

# **Average-load testing**

An average-load test assesses how the system performs under typical load. Typical load might be a regular day in production or an average moment.

Average-load tests simulate the number of concurrent users and requests per second that reflect average behaviors in the production environment. This type of test typically increases the throughput or VUs gradually and keeps that average load for some time. Depending on the system’s characteristics, the test may stop suddenly or have a short ramp-down period.

![](https://grafana.com/media/docs/k6-oss/chart-average-load-test-overview.png)

Since “load test” might refer to all types of tests that simulate traffic, this guide uses the name *average-load test* to avoid confusion. In some testing conversation, this test also might be called a day-in-life test or volume test.

## **When to run an average-load test**

Average-Load testing helps understand whether a system meets performance goals on a typical day (commonplace load). *Typical day* here means when an average number of users access the application at the same time, doing normal, average work.

You should run an average-load test to:

- Assess the performance of your system under a typical load.
- Identify early degradation signs during the ramp-up or full load periods.
- Assure that the system still meets the performance standards after system changes (code and infrastructure).

## **Considerations**

When you prepare an average-load test, consider the following:

- **Know the specific number of users and the typical throughput per process in the system.**

    To find this, look through APMs or analytic tools that provide information from the production environment. If you can’t access such tools, the business must provide these estimations.

- **Gradually increase load to the target average.**

    That is, use a *ramp-up period*. This period usually lasts between 5% and 15% of the total test duration. A ramp-up period has many essential uses:

    - It gives your system time to warm up or auto-scale to handle the traffic.
    - It lets you compare response times between the low-load and average-load stages.
    - If you run tests using our cloud service, a ramp up lets the automated performance alerts understand the expected behavior of your system.
- **Maintain average for a period longer than the ramp up.**

    Aim for an average duration at least five times longer than the ramp-up to assess the performance trend over a significant period of time.

- **Consider a ramp-down period.**

    The ramp down is when virtual user activity gradually decreases. The ramp down usually lasts as long as the ramp up or a bit less.


## **Results analysis**

An initial outcome for the average-load test appears during the ramp-up period to find whether the response time degrades as the load increases. Some systems might even fail during the ramp-up period.

The test validates if the system’s performance and resource consumption stay stable during the period of full load, as some systems may display erratic behavior in this period.

# **Stress testing**

Stress testing assesses how the system performs when loads are heavier than usual.

The load pattern of a stress test resembles that of an average load test. The main difference is higher load. To account for higher load, the ramp-up period takes longer in proportion to the load increase. Similarly, after the test reaches the desired load, it might last for slightly longer than it would in the average load test.

![](https://grafana.com/media/docs/k6-oss/chart-stress-test-overview.png)

In some testing conversation, stress tests might also be called rush-hour, surge, or scale tests.

## **When to perform a Stress test**

Stress tests verify the stability and reliability of the system under conditions of heavy use. Systems may receive higher than usual workloads on unusual moments such as process deadlines, paydays, rush hours, ends of the workweek, and many other behaviors that might cause frequent higher-than-average traffic.

## **Considerations**

When you run a stress test, consider the following:

- **The load should be higher than what the system experiences on average.**

    Some testers might have default targets for stress tests—say an increase upon average load by 50 or 100 percent—there’s no fixed percentage.

    The load simulated in a Stress test depends on the stressful situations that the system may be subject to. Sometimes this may be just a few percentage points above that average. Other times, it can be 50 to 100% higher, as mentioned. Some stressful situations can be twice, triple, or even orders of magnitude higher.

    Define load according to the risk load patterns that the system may receive.

- **Only run stress tests after running average-load tests.**

    Identify performance issues under average-load tests before trying anything more challenging. This sequence is essential.

- **Re-use the Average-Load test script.**

    Modify the parameters to have higher loads or VUs.

- **Expect worse performance compared to the average load.**

    This test determines how much the performance degrades with the extra load and whether the system survives it. A well-performant system should respond with consistent response times when handling a constant workload for an extended period.


## **Results analysis**

Like the average-load test, an initial outcome for the Stress test shows up during the ramp-up period to identify response time degradation as the load increases further than the average utilization. Commonly, the performance degrades, and even the system’s stability crashes as we push the system further than the average load test.

During the full load period, verification is vital if the system’s performance and resource consumption stays stable with a higher load.

# **Soak testing**

Soak testing is another variation of the average load test. It focuses on extended periods, analyzing the following:

- The system’s degradation of performance and resource consumption over extended periods.
- The system’s availability and stability during extended periods.

The soak test differs from an average-load test in test duration. In a soak test, the peak load duration (usually an average amount) extends several hours and even days. Though the duration is considerably longer, the ramp-up and ramp-down periods of a soak test are the same as an average load test.

![](https://grafana.com/media/docs/k6-oss/chart-soak-test-overview.png)

In some testing conversations, a soak test might be called an endurance, constant high load, or stamina test.

## **When to perform a Soak test**

Most systems must stay turned on and keep working for days, weeks, and months without intervention. This test verifies the system stability and reliability over extended periods of use.

This test type checks for common performance defects that show only after extended use. Those problems include response time degradation, memory or other resource leaks, data saturation, and storage depletion.

## **Considerations**

When you prepare to run a soak test, consider the following:

- **Configure the duration to be considerably longer than any other test.**

    Some typical values are 3, 4, 8, 12, 24, and 48 to 72 hours.

- **If possible, re-use the average-load test script**

    Only the peak durations for the aforementioned values are changed.

- **Don’t run soak tests before running smoke and average-load tests.**

    Each test uncovers different problems. Running this first may cause confusion and resource waste.

- **Monitor the backend resources and code efficiency.** Since we are checking for system degradation, monitoring the backend resources and code efficiency is highly recommended. Of all test types, backend monitoring is especially important for soak tests.

## **Results analysis**

If we execute this test after the previous types, we should have a system performing well under previous scenarios. In this test, monitor for changes in any performance metric as time passes. Try to correlate any impact with backend measurement changes that indicate degradation over time. Such changes can be gradual degradations, as mentioned, and sudden changes (improvements, too) in response time and backend hardware resources. Backend resources to check are RAM consumed, CPU, Network, and growth of cloud resources, among others.

The expected outcome is that the performance and resource utilization of the backend stays stable or within expected variations.

After you run all the previous test types, you know your system performs well at many different loads: small, average, high, and extended.

# **Spike testing**

A spike test verifies whether the system survives and performs under sudden and massive rushes of utilization.

Spike tests are useful when the system may experience events of sudden and massive traffic. Examples of such events include ticket sales (Taylor Swift), product launches (PS5), broadcast ads (Super Bowl), process deadlines (tax declaration), and seasonal sales (Black Friday). Also, spikes in traffic could be caused by more frequent events such as rush hours, a particular task, or a use case.

Spike testing increases to extremely high loads in a very short or non-existent ramp-up time. Usually, it has no plateau period or is very brief, as real users generally do not stick around doing extra steps in these situations. In the same way, the ramp-down is very fast or non-existent, letting the process iterate only once.

This test might include different processes than the previous test types, as spikes often aren’t part of an average day in production. It may also require adding, removing, or modifying processes on the script that were not in the average-load tests.

Occasionally, teams should revamp the system to allow or prioritize resources for the high-demand processes during the event.

![](https://grafana.com/media/docs/k6-oss/chart-spike-test-overview.png)

## **When to perform a spike test**

This test must be executed when the system expects to receive a sudden rush of activity.

When the system expects this type of behavior, the spike test helps identify how the system will behave and if it will survive the sudden rush of load. The load is considerably above the average and might focus on a different set of processes than the other test types.

## **Considerations**

When preparing for a spike test, consider the following:

- **Focus on key processes in this test type.**

    Assess whether the spike in traffic triggers the same or different processes from the other test types. Create test logic accordingly.

- **The test often won’t finish.**

    Errors are common in these scenarios.

- **Run, tune, repeat.**

    When your system is at risk of spike events, the team must run a spikes test and tune the system several times.

- **Monitor.**

    Backend monitoring is a must for successful outcomes of this test.


## **Results analysis**

Some performance metrics to assess in spike tests include pod speeds, recovery times after the load rush, time to return to normal, or the behavior of crucial system processes during the overload.

Finding how the system responds (if it survives) to the sudden rush helps to optimize it to guarantee that it can perform during a real event. In some events, the load is so high that the whole system may have to be optimized to deal with the key processes. In these cases, repeat the test until the system confidence is high.

# **Breakpoint testing**

Breakpoint testing aims to find system limits. Reasons you might want to know the limits include:

- To tune or care for the system’s weak spots to relocate those higher limits at higher levels.
- To help plan remediation steps in those cases and prepare for when the system nears those limits.

In other words, knowing where and how a system starts to fail helps prepare for such limits.

A breakpoint ramps to unrealistically high numbers. This test commonly has to be stopped manually or automatically as thresholds start to fail. When these problems appear, the system has reached its limits.

![](https://grafana.com/media/docs/k6-oss/chart-breakpoint-test-overview.png)

The breakpoint test is another test type with no clear naming consensus. In some testing conversations, it’s also known as capacity, point load, and limit testing.

## **When to run a breakpoint test**

Teams execute a breakpoint test whenever they must know their system’s diverse limits. Some conditions that may warrant a breakpoint test include the following:

- The need to know if the system’s load expects to grow continuously
- If current resource consumption is considered high
- After significant changes to the code-base or infrastructure.

How often to run this test type depends on the risk of reaching the system limits and the number of changes to provision infrastructure components.

Once the breakpoint runs and the system limits have been identified, you can repeat the test after the tuning exercise to validate how it impacted limits. Repeat the test-tune cycle until the team is satisfied.

## **Considerations**

- **Avoid breakpoint tests in elastic cloud environments.**

    The elastic environment may grow as the test moves further, finding only the limit of your cloud account bill. If this test runs on a cloud environment, **turning off elasticity on all the affected components is strongly recommended**.

- **Increase the load gradually.**

    A sudden increase may make it difficult to pinpoint why and when the system starts to fail.

- **System failure could mean different things to different teams**

    You might want to identify each of the following failure points:

    - Degraded performance. The response times increased, and user experience decreased.
    - Troublesome performance. The response times get to a point where the user experience severely degrades.
    - Timeouts. Processes are failing due to extremely high response times.
    - Errors. The system starts responding with HTTP error codes.
    - System failure. The system collapsed.
- **You can repeat this test several times**

    Repeating after each tuning might let you push the system further.

- **Run breakpoints only when the system is known to perform under all other test types.**

    The breakpoint test might go far if the system performs poorly with the previous testing types.


## **Results analysis**

A breakpoint test must cause a system failure. The test helps identify the failure points of our system and how the system behaves once it reaches its limits.

Once the system limits are identified, the team has two choices: accept them or tune the system.

If the decision is to accept the limits, the test results help teams prepare and act when the system is nearing such limits.

These actions could be:

- Prevent reaching such limits
- Grow system resources
- Implement corrective actions for the system behavior at its limit
- Tune the system to stretch its limits

If the action taken is to tune the system, tune, then repeat the breakpoint test to find where and whether the system limits moved.

A team must determine the number of repetitions of the breakpoint test, how much the system can be tuned, and how far its limits can be tuned after each exercise.
