using System;
using Moq;

namespace Roadmap.API.Tests.FakeClasses.Builders
{
    public class FakeUserManagerBuilder
    {
        private Mock<FakeUserManager> _mock = new Mock<FakeUserManager>();

        public Mock<FakeUserManager> Build()
        {
            return _mock;
        }

        public FakeUserManagerBuilder With(Action<Mock<FakeUserManager>> mock)
        {
            mock(_mock);
            return this;
        }
    }
}